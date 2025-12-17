#!/usr/bin/env python3
"""
Simple startup script for Azure App Service
"""
import os
import sys

# Add current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Set environment variables if not set
os.environ.setdefault('FLASK_ENV', 'production')
os.environ.setdefault('FLASK_DEBUG', 'False')

try:
    from app import app
    
    if __name__ == "__main__":
        port = int(os.environ.get('PORT', 8000))
        app.run(host='0.0.0.0', port=port, debug=False)
        
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Current directory: {current_dir}")
    print(f"Python path: {sys.path}")
    sys.exit(1)
except Exception as e:
    print(f"Startup error: {e}")
    sys.exit(1)