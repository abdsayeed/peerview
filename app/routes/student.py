from flask import Blueprint, request
from app.services.cosmos_service import cosmos_service
from app.services.blob_service import blob_service
from app.models.question_model import QuestionModel
from app.utils.auth_middleware import token_required, role_required
from app.utils.validators import (
    validate_required_fields, validate_file_extension, 
    validate_module_code, validate_question_id, validate_text_length,
    ValidationError
)
from app.utils.response_handler import (
    success_response, error_response, validation_error_response, 
    created_response, not_found_response, forbidden_response
)
from app.utils.rate_limiter import rate_limiter
from app.config import Config

bp = Blueprint('student', __name__, url_prefix='/student')

@bp.route('/question', methods=['POST'])
@token_required
@role_required('student')
def post_question():
    try:
        user = request.user
        
        if not rate_limiter.check_question_limit(user['userId'], Config.RATE_LIMIT_QUESTIONS_PER_DAY):
            current_count = rate_limiter.get_question_count(user['userId'])
            return forbidden_response(
                f"Daily question limit reached. You have posted {current_count}/{Config.RATE_LIMIT_QUESTIONS_PER_DAY} questions today."
            )
        
        title = request.form.get('title')
        module_code = request.form.get('moduleCode')
        question_id = request.form.get('questionId')
        description = request.form.get('description', '')
        
        if not title or not module_code or not question_id:
            return validation_error_response("Missing required fields: title, moduleCode, questionId")
        
        validate_text_length(title, 5, 200, "title")
        validate_module_code(module_code)
        validate_question_id(question_id)
        
        if description:
            validate_text_length(description, 0, 2000, "description")
        
        existing_question = cosmos_service.get_question_by_id(question_id)
        if existing_question:
            return error_response("Question with this ID already exists", 409)
        
        media_url = None
        media_type = None
        
        if 'file' in request.files:
            file = request.files['file']
            if file.filename:
                validate_file_extension(file.filename, Config.ALLOWED_EXTENSIONS)
                
                media_url = blob_service.upload_file(file.stream, file.filename)
                
                file_ext = file.filename.rsplit('.', 1)[1].lower()
                if file_ext in {'png', 'jpg', 'jpeg', 'gif'}:
                    media_type = 'image'
                elif file_ext in {'mp4', 'mov', 'avi'}:
                    media_type = 'video'
        
        question_data = QuestionModel.create(
            title=title,
            module_code=module_code.upper(),
            question_id=question_id,
            student_id=user['userId'],
            student_email=user['email'],
            description=description,
            media_url=media_url,
            media_type=media_type
        )
        
        created_question = cosmos_service.create_question(question_data)
        
        response_data = QuestionModel.to_response_dict(created_question)
        
        return created_response(response_data, "Question posted successfully")
        
    except ValidationError as e:
        return validation_error_response(e.message, e.field)
    except ValueError as e:
        return error_response(str(e), 409)
    except Exception as e:
        return error_response(f"Failed to post question: {str(e)}", 500)

@bp.route('/questions', methods=['GET'])
def get_all_questions():
    try:
        module_code = request.args.get('moduleCode')
        
        if module_code:
            module_code = module_code.upper()
        
        questions = cosmos_service.get_all_questions(module_code)
        
        response_questions = [QuestionModel.to_response_dict(q) for q in questions]
        
        return success_response({
            'questions': response_questions,
            'count': len(response_questions)
        })
        
    except Exception as e:
        return error_response(f"Failed to retrieve questions: {str(e)}", 500)

@bp.route('/question/<question_id>', methods=['GET'])
def get_question_by_id(question_id):
    try:
        question = cosmos_service.get_question_by_id(question_id)
        
        if not question:
            return not_found_response("Question not found")
        
        response_data = QuestionModel.to_response_dict(question)
        
        return success_response(response_data)
        
    except Exception as e:
        return error_response(f"Failed to retrieve question: {str(e)}", 500)
