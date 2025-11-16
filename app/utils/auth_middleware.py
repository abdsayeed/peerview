from functools import wraps
from flask import request
from app.utils.jwt_helper import verify_token
from app.utils.response_handler import unauthorized_response, forbidden_response

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header:
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return unauthorized_response("Invalid token format. Use 'Bearer <token>'")
        
        if not token:
            return unauthorized_response("Authentication token is missing")
        
        is_valid, payload = verify_token(token)
        
        if not is_valid:
            return unauthorized_response("Invalid or expired token")
        
        request.user = payload
        return f(*args, **kwargs)
    
    return decorated

def role_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(request, 'user'):
                return unauthorized_response("Authentication required")
            
            user_role = request.user.get('role')
            
            if user_role not in allowed_roles:
                return forbidden_response(f"Access denied. Required role: {', '.join(allowed_roles)}")
            
            return f(*args, **kwargs)
        return decorated
    return decorator
