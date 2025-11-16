from flask import Blueprint

bp = Blueprint('main', __name__)

@bp.route('/', methods=['GET'])
def health_check():
    return {
        "success": True,
        "message": "PeerView API is running",
        "version": "1.0.0",
        "endpoints": {
            "auth": [
                "POST /auth/register",
                "POST /auth/login"
            ],
            "student": [
                "POST /student/question",
                "GET /student/questions",
                "GET /student/question/<id>"
            ],
            "teacher": [
                "GET /teacher/questions",
                "POST /teacher/answer/<questionId>",
                "DELETE /teacher/answer/<answerId>"
            ],
            "admin": [
                "GET /admin/all",
                "DELETE /admin/question/<id>",
                "POST /admin/create-teacher",
                "POST /admin/create-student"
            ]
        }
    }, 200
