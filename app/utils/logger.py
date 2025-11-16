import logging
import sys
from datetime import datetime

def setup_logger(name: str, level=logging.INFO):
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(level)
        
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        handler.setFormatter(formatter)
        
        logger.addHandler(handler)
    
    return logger

def log_request(user_id: str, endpoint: str, method: str, status_code: int):
    logger = setup_logger('api_requests')
    logger.info(f"User: {user_id} | {method} {endpoint} | Status: {status_code}")

def log_error(error_message: str, error_type: str = "ERROR"):
    logger = setup_logger('api_errors')
    logger.error(f"{error_type}: {error_message}")

def log_security_event(event_type: str, user_id: str, details: str):
    logger = setup_logger('security')
    logger.warning(f"SECURITY [{event_type}] - User: {user_id} - {details}")
