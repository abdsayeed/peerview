#!/usr/bin/env python3
"""
Azure App Service startup script for PeerView backend
"""
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

try:
    from app import app
    print("Flask app imported successfully")
except Exception as e:
    print(f"Error importing app: {e}")
    sys.exit(1)

if __name__ == "__main__":
    # Azure App Service will set the PORT environment variable
    port = int(os.environ.get('PORT', 8000))
    print(f"Starting Flask app on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)