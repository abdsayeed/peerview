from flask import Blueprint, request
from app.services.cosmos_service import cosmos_service
from app.models.user_model import UserModel
from app.models.question_model import QuestionModel
from app.utils.auth_middleware import token_required, role_required
from app.utils.validators import (
    validate_email_format, validate_required_fields, 
    validate_role, validate_password_strength, ValidationError
)
from app.utils.password_helper import hash_password
from app.utils.response_handler import (
    success_response, error_response, validation_error_response,
    created_response, not_found_response
)

bp = Blueprint('admin', __name__, url_prefix='/admin')

@bp.route('/all', methods=['GET'])
@token_required
@role_required('admin')
def get_all_data():
    try:
        questions = cosmos_service.get_all_questions()
        users = cosmos_service.get_all_users()
        
        response_questions = [QuestionModel.to_response_dict(q) for q in questions]
        safe_users = [UserModel.to_safe_dict(u) for u in users]
        
        return success_response({
            'questions': response_questions,
            'users': safe_users,
            'stats': {
                'totalQuestions': len(response_questions),
                'totalUsers': len(safe_users),
                'usersByRole': {
                    'students': len([u for u in users if u.get('role') == 'student']),
                    'teachers': len([u for u in users if u.get('role') == 'teacher']),
                    'admins': len([u for u in users if u.get('role') == 'admin'])
                }
            }
        })
        
    except Exception as e:
        return error_response(f"Failed to retrieve data: {str(e)}", 500)

@bp.route('/question/<question_id>', methods=['DELETE'])
@token_required
@role_required('admin')
def delete_question(question_id):
    try:
        success = cosmos_service.delete_question(question_id)
        
        if not success:
            return not_found_response("Question not found")
        
        return success_response(None, "Question deleted successfully")
        
    except Exception as e:
        return error_response(f"Failed to delete question: {str(e)}", 500)

@bp.route('/create-teacher', methods=['POST'])
@token_required
@role_required('admin')
def create_teacher():
    try:
        data = request.get_json()
        
        validate_required_fields(data, ['email', 'password'])
        
        email = data['email'].lower().strip()
        password = data['password']
        
        validate_email_format(email)
        validate_password_strength(password)
        
        existing_user = cosmos_service.get_user_by_email(email)
        if existing_user:
            return error_response("User with this email already exists", 409)
        
        password_hash = hash_password(password)
        
        user_data = UserModel.create(email, password_hash, 'teacher')
        
        created_user = cosmos_service.create_user(user_data)
        
        safe_user = UserModel.to_safe_dict(created_user)
        
        return created_response(safe_user, "Teacher account created successfully")
        
    except ValidationError as e:
        return validation_error_response(e.message, e.field)
    except ValueError as e:
        return error_response(str(e), 409)
    except Exception as e:
        return error_response(f"Failed to create teacher: {str(e)}", 500)

@bp.route('/create-student', methods=['POST'])
@token_required
@role_required('admin')
def create_student():
    try:
        data = request.get_json()
        
        validate_required_fields(data, ['email', 'password'])
        
        email = data['email'].lower().strip()
        password = data['password']
        
        validate_email_format(email)
        validate_password_strength(password)
        
        existing_user = cosmos_service.get_user_by_email(email)
        if existing_user:
            return error_response("User with this email already exists", 409)
        
        password_hash = hash_password(password)
        
        user_data = UserModel.create(email, password_hash, 'student')
        
        created_user = cosmos_service.create_user(user_data)
        
        safe_user = UserModel.to_safe_dict(created_user)
        
        return created_response(safe_user, "Student account created successfully")
        
    except ValidationError as e:
        return validation_error_response(e.message, e.field)
    except ValueError as e:
        return error_response(str(e), 409)
    except Exception as e:
        return error_response(f"Failed to create student: {str(e)}", 500)
