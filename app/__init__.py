from flask import Flask
from flask_cors import CORS
from app.config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    CORS(app, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    from app.services.cosmos_service import cosmos_service
    from app.services.blob_service import blob_service
    
    with app.app_context():
        try:
            cosmos_service.initialize()
            print("✓ Cosmos DB initialized successfully")
        except Exception as e:
            print(f"✗ Failed to initialize Cosmos DB: {str(e)}")
        
        try:
            blob_service.initialize()
            print("✓ Blob Storage initialized successfully")
        except Exception as e:
            print(f"✗ Failed to initialize Blob Storage: {str(e)}")
    
    from app.routes import auth, student, teacher, admin
    
    app.register_blueprint(auth.bp)
    app.register_blueprint(student.bp)
    app.register_blueprint(teacher.bp)
    app.register_blueprint(admin.bp)
    
    from app.routes import main
    app.register_blueprint(main.bp)
    
    @app.errorhandler(404)
    def not_found(error):
        from app.utils.response_handler import error_response
        return error_response("Endpoint not found", 404)
    
    @app.errorhandler(405)
    def method_not_allowed(error):
        from app.utils.response_handler import error_response
        return error_response("Method not allowed", 405)
    
    @app.errorhandler(500)
    def internal_error(error):
        from app.utils.response_handler import error_response
        return error_response("Internal server error", 500)
    
    @app.errorhandler(413)
    def request_entity_too_large(error):
        from app.utils.response_handler import error_response
        return error_response("File too large. Maximum size is 50MB", 413)
    
    return app
