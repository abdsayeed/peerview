from functools import wraps
from flask import request
from utils.logger import log_request

def log_api_request(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        response = f(*args, **kwargs)
        
        user_id = getattr(request, 'user', {}).get('user_id', 'anonymous')
        endpoint = request.path
        method = request.method
        status_code = response[1] if isinstance(response, tuple) else 200
        
        log_request(user_id, endpoint, method, status_code)
        
        return response
    return decorated
