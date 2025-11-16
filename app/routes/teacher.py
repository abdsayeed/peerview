from flask import Blueprint, request
from app.services.cosmos_service import cosmos_service
from app.models.question_model import QuestionModel
from app.utils.auth_middleware import token_required, role_required
from app.utils.validators import (
    validate_required_fields, validate_text_length, ValidationError
)
from app.utils.response_handler import (
    success_response, error_response, validation_error_response,
    not_found_response, forbidden_response
)
from app.utils.rate_limiter import rate_limiter
from app.config import Config

bp = Blueprint('teacher', __name__, url_prefix='/teacher')

@bp.route('/questions', methods=['GET'])
@token_required
@role_required('teacher', 'admin')
def get_questions():
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

@bp.route('/answer/<question_id>', methods=['POST'])
@token_required
@role_required('teacher', 'admin')
def add_answer(question_id):
    try:
        user = request.user
        
        if user['role'] == 'teacher':
            if not rate_limiter.check_answer_limit(user['userId'], Config.RATE_LIMIT_ANSWERS_PER_MINUTE):
                current_count = rate_limiter.get_answer_count(user['userId'])
                return forbidden_response(
                    f"Answer rate limit reached. You have posted {current_count}/{Config.RATE_LIMIT_ANSWERS_PER_MINUTE} answers in the last minute."
                )
        
        data = request.get_json()
        
        validate_required_fields(data, ['answerText'])
        
        answer_text = data['answerText']
        metadata = data.get('metadata', {})
        
        validate_text_length(answer_text, 1, 5000, "answerText")
        
        question = cosmos_service.get_question_by_id(question_id)
        if not question:
            return not_found_response("Question not found")
        
        answer_data = QuestionModel.create_answer(
            teacher_id=user['userId'],
            teacher_email=user['email'],
            answer_text=answer_text,
            metadata=metadata
        )
        
        updated_question = cosmos_service.add_answer_to_question(question_id, answer_data)
        
        response_data = QuestionModel.to_response_dict(updated_question)
        
        return success_response(response_data, "Answer added successfully")
        
    except ValidationError as e:
        return validation_error_response(e.message, e.field)
    except ValueError as e:
        return not_found_response(str(e))
    except Exception as e:
        return error_response(f"Failed to add answer: {str(e)}", 500)

@bp.route('/answer/<answer_id>', methods=['DELETE'])
@token_required
@role_required('teacher', 'admin')
def delete_answer(answer_id):
    try:
        user = request.user
        question_id = request.args.get('questionId')
        
        if not question_id:
            return validation_error_response("questionId query parameter is required", "questionId")
        
        updated_question = cosmos_service.delete_answer_from_question(
            question_id, 
            answer_id, 
            user['userId'], 
            user['role']
        )
        
        response_data = QuestionModel.to_response_dict(updated_question)
        
        return success_response(response_data, "Answer deleted successfully")
        
    except ValueError as e:
        return not_found_response(str(e))
    except PermissionError as e:
        return forbidden_response(str(e))
    except Exception as e:
        return error_response(f"Failed to delete answer: {str(e)}", 500)
