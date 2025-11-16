import re
from email_validator import validate_email, EmailNotValidError
from typing import Dict, List, Any, Optional

class ValidationError(Exception):
    def __init__(self, message: str, field: Optional[str] = None):
        self.message = message
        self.field = field
        super().__init__(self.message)

def validate_email_format(email: str) -> bool:
    try:
        validate_email(email)
        return True
    except EmailNotValidError:
        raise ValidationError("Invalid email format", "email")

def validate_required_fields(data: Dict[str, Any], required_fields: List[str]) -> None:
    missing_fields = [field for field in required_fields if field not in data or not data[field]]
    if missing_fields:
        raise ValidationError(f"Missing required fields: {', '.join(missing_fields)}")

def validate_role(role: str) -> bool:
    valid_roles = ['student', 'teacher', 'admin']
    if role not in valid_roles:
        raise ValidationError(f"Invalid role. Must be one of: {', '.join(valid_roles)}", "role")
    return True

def validate_file_extension(filename: str, allowed_extensions: set) -> bool:
    if '.' not in filename:
        raise ValidationError("File must have an extension", "file")
    ext = filename.rsplit('.', 1)[1].lower()
    if ext not in allowed_extensions:
        raise ValidationError(f"File type not allowed. Allowed: {', '.join(allowed_extensions)}", "file")
    return True

def validate_password_strength(password: str) -> bool:
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters long", "password")
    if not re.search(r'[A-Z]', password):
        raise ValidationError("Password must contain at least one uppercase letter", "password")
    if not re.search(r'[a-z]', password):
        raise ValidationError("Password must contain at least one lowercase letter", "password")
    if not re.search(r'\d', password):
        raise ValidationError("Password must contain at least one digit", "password")
    return True

def validate_module_code(module_code: str) -> bool:
    if not module_code or len(module_code) < 2:
        raise ValidationError("Module code must be at least 2 characters", "moduleCode")
    if not re.match(r'^[A-Z0-9\-]+$', module_code.upper()):
        raise ValidationError("Module code must contain only letters, numbers, and hyphens", "moduleCode")
    return True

def validate_question_id(question_id: str) -> bool:
    if not question_id or len(question_id) < 3:
        raise ValidationError("Question ID must be at least 3 characters", "questionId")
    return True

def validate_text_length(text: str, min_length: int = 1, max_length: int = 5000, field_name: str = "text") -> bool:
    if len(text) < min_length:
        raise ValidationError(f"{field_name} must be at least {min_length} characters", field_name)
    if len(text) > max_length:
        raise ValidationError(f"{field_name} must not exceed {max_length} characters", field_name)
    return True
