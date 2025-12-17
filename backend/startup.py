#!/usr/bin/env python3
"""
Azure App Service startup script for PeerView backend
"""
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

from app import app

if __name__ == "__main__":
    # Azure App Service will set the PORT environment variable
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)