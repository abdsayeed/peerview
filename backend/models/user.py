from datetime import datetime
from enum import Enum

class UserRole(Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"

class User:
    def __init__(self, email, password_hash, full_name, role=UserRole.STUDENT):
        self.id = None
        self.email = email
        self.password_hash = password_hash
        self.full_name = full_name
        self.role = role
        self.created_at = datetime.utcnow().isoformat()
        self.is_active = True
    
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "fullName": self.full_name,
            "role": self.role.value if isinstance(self.role, UserRole) else self.role,
            "createdAt": self.created_at,
            "isActive": self.is_active
        }
    
    @classmethod
    def from_dict(cls, data):
        user = cls(
            email=data.get("email"),
            password_hash=data.get("passwordHash"),
            full_name=data.get("fullName"),
            role=UserRole(data.get("role", "student"))
        )
        user.id = data.get("id")
        user.created_at = data.get("createdAt")
        user.is_active = data.get("isActive", True)
        return user