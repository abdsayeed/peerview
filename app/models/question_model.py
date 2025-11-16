from datetime import datetime
from typing import Dict, List, Optional
import uuid

class QuestionModel:
    @staticmethod
    def create(
        title: str,
        module_code: str,
        question_id: str,
        student_id: str,
        student_email: str,
        description: Optional[str] = None,
        media_url: Optional[str] = None,
        media_type: Optional[str] = None
    ) -> Dict:
        return {
            'id': question_id,
            'questionId': question_id,
            'title': title,
            'description': description,
            'moduleCode': module_code,
            'studentId': student_id,
            'studentEmail': student_email,
            'mediaUrl': media_url,
            'mediaType': media_type,
            'answers': [],
            'createdAt': datetime.utcnow().isoformat(),
            'updatedAt': datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def create_answer(
        teacher_id: str,
        teacher_email: str,
        answer_text: str,
        metadata: Optional[Dict] = None
    ) -> Dict:
        return {
            'answerId': str(uuid.uuid4()),
            'teacherId': teacher_id,
            'teacherEmail': teacher_email,
            'answerText': answer_text,
            'metadata': metadata or {},
            'createdAt': datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def to_response_dict(question: Dict) -> Dict:
        response = question.copy()
        response.pop('_rid', None)
        response.pop('_self', None)
        response.pop('_etag', None)
        response.pop('_attachments', None)
        response.pop('_ts', None)
        return response
