from flask import Flask, request, jsonify, g, send_from_directory
from flask_cors import CORS
from datetime import datetime
import os
import logging
from services.cosmos_service import CosmosService
from services.blob_service import BlobService
from services.auth_service import AuthService
from services.admin_service import AdminService
from services.logic_app_service import LogicAppService
from middleware.auth_middleware import token_required, role_required, admin_required, teacher_or_admin_required

# Azure Application Insights
from opencensus.ext.azure.log_exporter import AzureLogHandler
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.ext.flask.flask_middleware import FlaskMiddleware
from opencensus.trace.samplers import ProbabilitySampler

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app, origins=[
    "http://localhost:4200",  # Development
])

# Configure Azure Application Insights
INSTRUMENTATION_KEY = os.getenv('APPINSIGHTS_INSTRUMENTATION_KEY')
if INSTRUMENTATION_KEY:
    # Add telemetry middleware
    middleware = FlaskMiddleware(
        app,
        exporter=AzureExporter(connection_string=f"InstrumentationKey={INSTRUMENTATION_KEY}"),
        sampler=ProbabilitySampler(rate=1.0)
    )
    
    # Configure logging to Application Insights
    logger = logging.getLogger(__name__)
    logger.addHandler(AzureLogHandler(connection_string=f"InstrumentationKey={INSTRUMENTATION_KEY}"))
    logger.setLevel(logging.INFO)
    
    app.logger.info("Application Insights configured successfully")

# Initialize services
cosmos_service = CosmosService()
blob_service = BlobService()
auth_service = AuthService()
admin_service = AdminService()
logic_app_service = LogicAppService()

# HEALTH CHECK
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'PeerView API', 'version': '1.0'}), 200

# AUTHENTICATION ENDPOINTS
@app.route('/v1/auth/register', methods=['POST'])
def register():
    """Register a new user account (student or teacher)"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('fullName')
        role = data.get('role', 'student')  # Default to student if not specified
        
        if not all([email, password, full_name]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate role
        if role not in ['student', 'teacher']:
            return jsonify({'error': 'Invalid role. Must be either "student" or "teacher"'}), 400
        
        user = auth_service.register_user(email, password, full_name, role)
        token = auth_service.generate_jwt_token(user)
        
        return jsonify({
            'user': user.to_dict(),
            'token': token
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/v1/auth/login', methods=['POST'])
def login():
    """Authenticate user and return JWT token"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'error': 'Email and password required'}), 400
        
        user, token = auth_service.authenticate_user(email, password)
        
        return jsonify({
            'user': user.to_dict(),
            'token': token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 401

@app.route('/v1/users/me', methods=['GET'])
@token_required
def get_current_user():
    """Get current user's profile"""
    try:
        user = auth_service.get_user_by_id(g.current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# MEDIA ENDPOINTS
@app.route('/v1/media/upload-url', methods=['POST'])
@token_required
def generate_upload_url():
    """Generate SAS URL for direct upload to Azure Blob Storage"""
    try:
        data = request.json
        file_name = data.get('fileName')
        file_type = data.get('fileType')
        
        if not all([file_name, file_type]):
            return jsonify({'error': 'fileName and fileType required'}), 400
        
        upload_info = blob_service.generate_upload_url(file_name, file_type)
        return jsonify(upload_info), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# QUESTIONS ENDPOINTS
@app.route('/v1/questions', methods=['GET'])
@token_required
def get_questions():
    """Get questions feed with pagination"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        
        questions = cosmos_service.get_questions_paginated(page, limit)
        return jsonify(questions), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Legacy endpoint for backward compatibility
@app.route('/api/feed', methods=['GET'])
def get_feed():
    """Get all questions with embedded answers for the feed (legacy)"""
    try:
        questions = cosmos_service.get_questions()
        return jsonify(questions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/v1/questions/<question_id>', methods=['GET'])
@token_required
def get_question_v1(question_id):
    """Get a specific question by ID"""
    try:
        question = cosmos_service.get_question(question_id)
        if question:
            return jsonify(question), 200
        return jsonify({'error': 'Question not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Legacy endpoint
@app.route('/api/questions/<question_id>', methods=['GET'])
def get_question(question_id):
    """Get a specific question by ID (legacy)"""
    try:
        question = cosmos_service.get_question(question_id)
        if question:
            return jsonify(question), 200
        return jsonify({'error': 'Question not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/v1/questions', methods=['POST'])
@token_required
@role_required(['student', 'teacher', 'admin'])
def create_question_v1():
    """Create a new question (Students only in production)"""
    try:
        data = request.json
        title = data.get('title')
        caption = data.get('caption')
        media_url = data.get('mediaUrl')
        media_type = data.get('mediaType', 'image')
        
        if not all([title, media_url, caption]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Use authenticated user ID
        question = cosmos_service.create_question(g.current_user_id, title, caption, media_url, media_type)
        
        # Trigger Logic App workflow for new question
        logic_app_service.trigger_question_workflow(question)
        
        return jsonify(question), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Legacy endpoint
@app.route('/api/questions', methods=['POST'])
def create_question():
    """Create a new question (legacy)"""
    try:
        data = request.json
        user_id = data.get('userId')
        title = data.get('title')
        caption = data.get('caption')
        media_url = data.get('mediaUrl')
        media_type = data.get('mediaType', 'image')
        
        if not all([user_id, title, media_url, caption]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        question = cosmos_service.create_question(user_id, title, caption, media_url, media_type)
        return jsonify(question), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/v1/questions/<question_id>/answers', methods=['POST'])
@token_required
@teacher_or_admin_required
def create_answer_v1(question_id):
    """Add an answer to a question (Teachers only)"""
    try:
        data = request.json
        text_response = data.get('textResponse')
        media_url = data.get('mediaUrl')
        
        if not text_response:
            return jsonify({'error': 'textResponse is required'}), 400
        
        # Use authenticated user ID
        answer = cosmos_service.add_answer(question_id, g.current_user_id, text_response, media_url)
        if answer:
            # Trigger Logic App workflow for new answer
            logic_app_service.trigger_answer_workflow(question_id, answer)
            return jsonify(answer), 201
        return jsonify({'error': 'Question not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Legacy endpoint
@app.route('/api/questions/<question_id>/answers', methods=['POST'])
def create_answer(question_id):
    """Add an answer to a question (legacy)"""
    try:
        data = request.json
        user_id = data.get('userId')
        text_response = data.get('textResponse')
        media_url = data.get('mediaUrl')
        
        if not all([user_id, text_response]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        answer = cosmos_service.add_answer(question_id, user_id, text_response, media_url)
        if answer:
            return jsonify(answer), 201
        return jsonify({'error': 'Question not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# QUESTION MANAGEMENT
@app.route('/v1/questions/<question_id>', methods=['PUT'])
@token_required
def update_question(question_id):
    """Update a question (Users can update own; Admins can update any)"""
    try:
        question = cosmos_service.get_question(question_id)
        if not question:
            return jsonify({'error': 'Question not found'}), 404
        
        # Check permissions
        if g.current_user_role != 'admin' and question['userId'] != g.current_user_id:
            return jsonify({'error': 'Permission denied'}), 403
        
        data = request.json
        title = data.get('title')
        caption = data.get('caption')
        media_url = data.get('mediaUrl')
        media_type = data.get('mediaType')
        
        if not all([title, caption]):
            return jsonify({'error': 'Title and caption are required'}), 400
        
        updated_question = cosmos_service.update_question(question_id, title, caption, media_url, media_type)
        if updated_question:
            return jsonify(updated_question), 200
        return jsonify({'error': 'Failed to update question'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/v1/questions/<question_id>', methods=['DELETE'])
@token_required
def delete_question(question_id):
    """Delete a question (Students can delete own; Admins can delete any)"""
    try:
        question = cosmos_service.get_question(question_id)
        if not question:
            return jsonify({'error': 'Question not found'}), 404
        
        # Check permissions
        if g.current_user_role != 'admin' and question['userId'] != g.current_user_id:
            return jsonify({'error': 'Permission denied'}), 403
        
        success = cosmos_service.delete_question(question_id)
        if success:
            return jsonify({'message': 'Question deleted successfully'}), 200
        return jsonify({'error': 'Failed to delete question'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ANSWER MANAGEMENT
@app.route('/v1/answers/<answer_id>', methods=['PUT'])
@token_required
@teacher_or_admin_required
def update_answer(answer_id):
    """Edit an existing answer (Teachers can edit own; Admins can edit any)"""
    try:
        data = request.json
        text_response = data.get('textResponse')
        media_url = data.get('mediaUrl')
        
        if not text_response:
            return jsonify({'error': 'textResponse is required'}), 400
        
        answer = cosmos_service.update_answer(answer_id, g.current_user_id, text_response, media_url, g.current_user_role)
        if answer:
            return jsonify(answer), 200
        return jsonify({'error': 'Answer not found or permission denied'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/v1/answers/<answer_id>', methods=['DELETE'])
@token_required
@teacher_or_admin_required
def delete_answer(answer_id):
    """Delete an answer (Teachers can delete own; Admins can delete any)"""
    try:
        success = cosmos_service.delete_answer(answer_id, g.current_user_id, g.current_user_role)
        if success:
            return jsonify({'message': 'Answer deleted successfully'}), 200
        return jsonify({'error': 'Answer not found or permission denied'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ADMINISTRATION ENDPOINTS
@app.route('/v1/admin/stats', methods=['GET'])
@token_required
@admin_required
def get_admin_stats():
    """Get system statistics (Admin only)"""
    try:
        stats = admin_service.get_system_stats()
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/v1/admin/moderation', methods=['POST'])
@token_required
@admin_required
def moderate_content():
    """Moderate content (Admin only)"""
    try:
        data = request.json
        target_type = data.get('targetType')  # 'question' or 'answer'
        target_id = data.get('targetId')
        action = data.get('action')  # 'remove' or 'flag'
        
        if not all([target_type, target_id, action]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        result = admin_service.moderate_content(target_type, target_id, action, g.current_user_id)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/v1/admin/flagged-content', methods=['GET'])
@token_required
@admin_required
def get_flagged_content():
    """Get all flagged content for review (Admin only)"""
    try:
        flagged_content = admin_service.get_flagged_content()
        return jsonify(flagged_content), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/v1/admin/users', methods=['GET'])
@token_required
@admin_required
def get_all_users():
    """Get all users with pagination (Admin only)"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 20))
        
        users = auth_service.get_all_users(page, limit)
        return jsonify([user.to_dict() for user in users]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/v1/admin/users/<user_id>/activity', methods=['GET'])
@token_required
@admin_required
def get_user_activity(user_id):
    """Get detailed user activity (Admin only)"""
    try:
        activity = admin_service.get_user_activity(user_id)
        return jsonify(activity), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Legacy upload endpoint
@app.route('/api/upload', methods=['POST'])
def upload_media():
    """Upload media file to Azure Blob Storage (legacy)"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400
        
        url = blob_service.upload_file(file)
        return jsonify({'url': url}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Media proxy endpoint
@app.route('/api/media/<blob_name>', methods=['GET'])
def serve_media(blob_name):
    """Serve media files from Azure Blob Storage"""
    try:
        blob_data = blob_service.get_blob_data(blob_name)
        
        from flask import Response
        return Response(
            blob_data['data'],
            mimetype=blob_data['content_type'],
            headers={
                'Content-Length': blob_data['content_length'],
                'Cache-Control': 'public, max-age=31536000',  # Cache for 1 year
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 404



# Debug endpoint to check media URLs
@app.route('/api/debug/media-urls', methods=['GET'])
def debug_media_urls():
    """Debug endpoint to check all media URLs in questions"""
    try:
        questions = cosmos_service.get_questions()
        debug_info = []
        
        for q in questions:
            media_url = q.get('mediaUrl', '')
            debug_info.append({
                'title': q.get('title', ''),
                'mediaUrl': media_url,
                'mediaType': q.get('mediaType', ''),
                'isProxyUrl': media_url.startswith('/api/media/') if media_url else False,
                'fullUrl': f"http://localhost:5001{media_url}" if media_url and media_url.startswith('/api/') else media_url
            })
        
        return jsonify({
            'totalQuestions': len(questions),
            'questions': debug_info
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ANGULAR FRONTEND ROUTES (MUST BE LAST)
@app.route('/')
def serve_index():
    """Serve Angular index.html at root"""
    return app.send_static_file('index.html')

@app.route('/<path:path>')
def serve_angular(path):
    """Serve Angular frontend for all non-API routes"""
    # API routes should return 404 if not found
    if path.startswith('v1/') or path.startswith('api/') or path.startswith('health'):
        return jsonify({'error': 'Not Found'}), 404
    
    # Try to serve static file if it exists (JS, CSS, images)
    try:
        return app.send_static_file(path)
    except:
        # Otherwise serve index.html for Angular routing
        return app.send_static_file('index.html')

if __name__ == '__main__':
    # For local development
    app.run(debug=True, host='0.0.0.0', port=5001)
