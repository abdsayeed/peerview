from functools import wraps
from flask import request, jsonify, g
from services.auth_service import AuthService

auth_service = AuthService()

def token_required(f):
    """Decorator to require JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Verify token
            payload = auth_service.verify_jwt_token(token)
            g.current_user_id = payload['user_id']
            g.current_user_email = payload['email']
            g.current_user_role = payload['role']
        except Exception as e:
            return jsonify({'error': str(e)}), 401
        
        return f(*args, **kwargs)
    
    return decorated

def role_required(required_roles):
    """Decorator to require specific roles"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(g, 'current_user_role'):
                return jsonify({'error': 'Authentication required'}), 401
            
            if g.current_user_role not in required_roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            
            return f(*args, **kwargs)
        
        return decorated
    return decorator

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(g, 'current_user_role'):
            return jsonify({'error': 'Authentication required'}), 401
        
        if g.current_user_role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    
    return decorated

def teacher_or_admin_required(f):
    """Decorator to require teacher or admin role"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not hasattr(g, 'current_user_role'):
            return jsonify({'error': 'Authentication required'}), 401
        
        if g.current_user_role not in ['teacher', 'admin']:
            return jsonify({'error': 'Teacher or admin access required'}), 403
        
        return f(*args, **kwargs)
    
    return decorated