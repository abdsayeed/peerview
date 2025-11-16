from datetime import datetime
from typing import Dict

class UserModel:
    @staticmethod
    def create(email: str, password_hash: str, role: str) -> Dict:
        return {
            'id': email,
            'email': email,
            'passwordHash': password_hash,
            'role': role,
            'createdAt': datetime.utcnow().isoformat()
        }
    
    @staticmethod
    def to_safe_dict(user: Dict) -> Dict:
        safe_user = user.copy()
        safe_user.pop('passwordHash', None)
        safe_user.pop('_rid', None)
        safe_user.pop('_self', None)
        safe_user.pop('_etag', None)
        safe_user.pop('_attachments', None)
        safe_user.pop('_ts', None)
        return safe_user
