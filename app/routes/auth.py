from flask import Blueprint, request
from app.services.cosmos_service import cosmos_service
from app.models.user_model import UserModel
from app.utils.validators import validate_email_format, validate_required_fields, validate_role, validate_password_strength, ValidationError
from app.utils.password_helper import hash_password, verify_password
from app.utils.jwt_helper import generate_token
from app.utils.response_handler import success_response, error_response, validation_error_response, created_response

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        validate_required_fields(data, ['email', 'password', 'role'])
        
        email = data['email'].lower().strip()
        password = data['password']
        role = data['role'].lower()
        
        validate_email_format(email)
        validate_password_strength(password)
        validate_role(role)
        
        existing_user = cosmos_service.get_user_by_email(email)
        if existing_user:
            return error_response("User with this email already exists", 409)
        
        password_hash = hash_password(password)
        
        user_data = UserModel.create(email, password_hash, role)
        
        created_user = cosmos_service.create_user(user_data)
        
        safe_user = UserModel.to_safe_dict(created_user)
        
        token = generate_token(safe_user['id'], safe_user['email'], safe_user['role'])
        
        return created_response({
            'user': safe_user,
            'token': token
        }, "User registered successfully")
        
    except ValidationError as e:
        return validation_error_response(e.message, e.field)
    except ValueError as e:
        return error_response(str(e), 409)
    except Exception as e:
        return error_response(f"Registration failed: {str(e)}", 500)

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        validate_required_fields(data, ['email', 'password'])
        
        email = data['email'].lower().strip()
        password = data['password']
        
        validate_email_format(email)
        
        user = cosmos_service.get_user_by_email(email)
        if not user:
            return error_response("Invalid email or password", 401)
        
        if not verify_password(password, user['passwordHash']):
            return error_response("Invalid email or password", 401)
        
        safe_user = UserModel.to_safe_dict(user)
        
        token = generate_token(safe_user['id'], safe_user['email'], safe_user['role'])
        
        return success_response({
            'user': safe_user,
            'token': token
        }, "Login successful")
        
    except ValidationError as e:
        return validation_error_response(e.message, e.field)
    except Exception as e:
        return error_response(f"Login failed: {str(e)}", 500)
