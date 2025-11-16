from flask import jsonify
from typing import Any, Dict, Optional

def success_response(data: Any = None, message: str = "Success", status_code: int = 200):
    response = {
        "success": True,
        "message": message
    }
    if data is not None:
        response["data"] = data
    return jsonify(response), status_code

def error_response(message: str, status_code: int = 400, errors: Optional[Dict] = None):
    response = {
        "success": False,
        "message": message
    }
    if errors:
        response["errors"] = errors
    return jsonify(response), status_code

def unauthorized_response(message: str = "Unauthorized access"):
    return jsonify({
        "success": False,
        "message": message
    }), 401

def forbidden_response(message: str = "Access forbidden"):
    return jsonify({
        "success": False,
        "message": message
    }), 403

def not_found_response(message: str = "Resource not found"):
    return jsonify({
        "success": False,
        "message": message
    }), 404

def validation_error_response(message: str, field: Optional[str] = None):
    response = {
        "success": False,
        "message": message
    }
    if field:
        response["field"] = field
    return jsonify(response), 422

def server_error_response(message: str = "Internal server error"):
    return jsonify({
        "success": False,
        "message": message
    }), 500

def created_response(data: Any = None, message: str = "Resource created successfully"):
    return success_response(data, message, 201)
