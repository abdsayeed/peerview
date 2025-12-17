import os
import jwt
import bcrypt
import uuid
from datetime import datetime, timedelta
from azure.cosmos import exceptions
from services.cosmos_service import CosmosService
from models.user import User, UserRole

class AuthService:
    def __init__(self):
        self.cosmos_service = CosmosService()
        self.jwt_secret = os.getenv('JWT_SECRET', 'your-secret-key-change-in-production')
        self.jwt_algorithm = 'HS256'
        self.jwt_expiration_hours = 24
        
        # Initialize users container
        try:
            self.users_container = self.cosmos_service.database.get_container_client('Users')
        except exceptions.CosmosResourceNotFoundError:
            # Create container if it doesn't exist
            self.users_container = self.cosmos_service.database.create_container(
                id='Users',
                partition_key={'paths': ['/id'], 'kind': 'Hash'}
            )
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
    
    def generate_jwt_token(self, user: User) -> str:
        """Generate JWT token for user"""
        payload = {
            'user_id': user.id,
            'email': user.email,
            'role': user.role.value if isinstance(user.role, UserRole) else user.role,
            'exp': datetime.utcnow() + timedelta(hours=self.jwt_expiration_hours),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, self.jwt_secret, algorithm=self.jwt_algorithm)
    
    def verify_jwt_token(self, token: str) -> dict:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=[self.jwt_algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise Exception("Token has expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")
    
    def register_user(self, email: str, password: str, full_name: str, role: str = "student") -> User:
        """Register a new user"""
        try:
            # Check if user already exists
            existing_user = self.get_user_by_email(email)
            if existing_user:
                raise Exception("User with this email already exists")
            
            # Create new user
            user_id = str(uuid.uuid4())
            password_hash = self.hash_password(password)
            
            user_data = {
                "id": user_id,
                "email": email,
                "passwordHash": password_hash,
                "fullName": full_name,
                "role": role,
                "createdAt": datetime.utcnow().isoformat(),
                "isActive": True
            }
            
            created_user = self.users_container.create_item(body=user_data)
            return User.from_dict(created_user)
            
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to register user: {e.message}")
    
    def authenticate_user(self, email: str, password: str) -> tuple[User, str]:
        """Authenticate user and return user object with JWT token"""
        user = self.get_user_by_email(email)
        if not user:
            raise Exception("Invalid email or password")
        
        if not user.is_active:
            raise Exception("Account is deactivated")
        
        # Get user data from Cosmos DB to verify password
        user_data = self.users_container.read_item(item=user.id, partition_key=user.id)
        
        if not self.verify_password(password, user_data['passwordHash']):
            raise Exception("Invalid email or password")
        
        token = self.generate_jwt_token(user)
        return user, token
    
    def get_user_by_email(self, email: str) -> User:
        """Get user by email"""
        try:
            query = "SELECT * FROM c WHERE c.email = @email"
            parameters = [{"name": "@email", "value": email}]
            
            items = list(self.users_container.query_items(
                query=query,
                parameters=parameters,
                enable_cross_partition_query=True
            ))
            
            if items:
                return User.from_dict(items[0])
            return None
            
        except exceptions.CosmosHttpResponseError:
            return None
    
    def get_user_by_id(self, user_id: str) -> User:
        """Get user by ID"""
        try:
            user_data = self.users_container.read_item(item=user_id, partition_key=user_id)
            return User.from_dict(user_data)
        except exceptions.CosmosResourceNotFoundError:
            return None
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to get user: {e.message}")
    
    def update_user(self, user_id: str, updates: dict) -> User:
        """Update user information"""
        try:
            user_data = self.users_container.read_item(item=user_id, partition_key=user_id)
            user_data.update(updates)
            updated_user = self.users_container.replace_item(item=user_id, body=user_data)
            return User.from_dict(updated_user)
        except exceptions.CosmosResourceNotFoundError:
            raise Exception("User not found")
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to update user: {e.message}")
    
    def delete_user(self, user_id: str) -> bool:
        """Delete user (soft delete by setting isActive to False)"""
        try:
            return self.update_user(user_id, {"isActive": False})
        except Exception as e:
            raise Exception(f"Failed to delete user: {str(e)}")
    
    def get_all_users(self, page: int = 1, limit: int = 20) -> list[User]:
        """Get all users with pagination"""
        try:
            offset = (page - 1) * limit
            query = f"SELECT * FROM c ORDER BY c.createdAt DESC OFFSET {offset} LIMIT {limit}"
            
            items = list(self.users_container.query_items(
                query=query,
                enable_cross_partition_query=True
            ))
            
            return [User.from_dict(item) for item in items]
            
        except exceptions.CosmosHttpResponseError as e:
            raise Exception(f"Failed to get users: {e.message}")