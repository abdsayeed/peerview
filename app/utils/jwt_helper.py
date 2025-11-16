import jwt
from datetime import datetime, timedelta
from typing import Dict, Optional, Tuple
from app.config import Config

def generate_token(user_id: str, email: str, role: str) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(minutes=Config.JWT_EXPIRATION_MINUTES)
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

def decode_token(token: str) -> Optional[Dict]:
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def verify_token(token: str) -> Tuple[bool, Optional[Dict]]:
    payload = decode_token(token)
    if payload is None:
        return False, None
    return True, payload
