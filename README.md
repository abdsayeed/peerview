# PeerView - Student Q&A Platform# PeerView Backend API



Modern Q&A platform for students and teachers, powered by Azure Cloud.# PeerView Backend



## 🚀 Quick Start## 🎯 Modern Flask Modular Structure



### Backend```

```powershellPeerView/

.\.venv\Scripts\Activate.ps1│

python run.py  # http://localhost:5000├── app/                        # Main application package

```│   ├── __init__.py            # App factory pattern

│   ├── config.py              # Configuration management

### Frontend│   │

```powershell│   ├── routes/                # Blueprint routes (controllers)

cd frontend│   │   ├── __init__.py

npm run dev  # http://localhost:5173│   │   ├── main.py           # Health check & API info

```│   │   ├── auth.py           # Authentication endpoints

│   │   ├── student.py        # Student operations

## 🛠️ Stack│   │   ├── teacher.py        # Teacher operations

│   │   └── admin.py          # Admin operations

**Backend:** Flask • Azure Cosmos DB • Azure Blob Storage  │   │

**Frontend:** React 19 • TypeScript • TailwindCSS 4.x│   ├── models/                # Data models

│   │   ├── __init__.py

## 📋 Setup│   │   ├── user_model.py

│   │   └── question_model.py

1. Install dependencies: `pip install -r requirements.txt` & `cd frontend && npm install`│   │

2. Configure Azure: Update `.env` (see `AZURE_SETUP_INSTRUCTIONS.md`)│   ├── services/              # Business logic layer

3. Start servers (commands above)│   │   ├── __init__.py

│   │   ├── cosmos_service.py # Cosmos DB operations

## 📚 Docs│   │   └── blob_service.py   # Blob Storage operations

│   │

- `AZURE_SETUP_INSTRUCTIONS.md` - Azure configuration│   └── utils/                 # Helper utilities

- `GETTING_STARTED.md` - Detailed setup│       ├── __init__.py

- `DEPLOYMENT.md` - Production deployment│       ├── auth_middleware.py

│       ├── jwt_helper.py

## 🔑 Key Features│       ├── password_helper.py

│       ├── validators.py

- Student: Post questions, view answers│       ├── response_handler.py

- Teacher: Answer questions, dashboard│       └── rate_limiter.py

- Admin: User & content management│

- JWT auth, media uploads, role-based access├── tests/                     # Test suite

│   ├── __init__.py

Built with ❤️ for education│   └── test_api.py

│
├── docs/                      # Documentation
│
├── run.py                     # Application entry point
├── .env                       # Environment variables
├── requirements.txt           # Python dependencies
└── README.md
```

## 🚀 Quick Start

### Start Server
```bash
python run.py
```

### With Environment
```bash
# Development (default)
python run.py

# Production
$env:FLASK_ENV="production"; python run.py
```

## 📦 Key Features

### Application Factory Pattern
- Uses `create_app()` factory function
- Environment-based configuration
- Easy testing with different configs

### Blueprint Architecture
- Modular route organization
- Each blueprint handles specific domain
- Clean separation of concerns

### Service Layer
- Business logic isolated from routes
- Reusable across endpoints
- Easy to test and maintain

### Middleware & Decorators
- `@token_required` - JWT authentication
- `@role_required('admin')` - RBAC
- Centralized error handling

## 🔧 Configuration

Environment configs in `app/config.py`:
- `DevelopmentConfig` - Debug enabled
- `ProductionConfig` - Optimized for prod
- `TestingConfig` - Testing mode

A comprehensive Flask-based REST API for a peer-to-peer learning platform with role-based access control, Azure Cosmos DB integration, and media upload capabilities.

## Features

- **JWT Authentication**: Secure token-based authentication with role-based access control
- **Role Management**: Three user roles (Student, Teacher, Admin) with specific permissions
- **Azure Cosmos DB**: NoSQL database for scalable data storage
- **Azure Blob Storage**: Media file storage with secure upload/download
- **Rate Limiting**: Prevents abuse with configurable limits
- **Advanced Validation**: Comprehensive input validation and error handling
- **CORS Support**: Cross-origin resource sharing for frontend integration

## Project Structure

```
PeerView/
├── app.py                          # Main Flask application
├── config.py                       # Configuration management
├── requirements.txt                # Python dependencies
├── .env.example                    # Environment variables template
├── controllers/                    # API route handlers
│   ├── auth_controller.py         # Authentication endpoints
│   ├── student_controller.py      # Student endpoints
│   ├── teacher_controller.py      # Teacher endpoints
│   └── admin_controller.py        # Admin endpoints
├── services/                       # External service integrations
│   ├── cosmos_service.py          # Cosmos DB operations
│   └── blob_service.py            # Blob Storage operations
├── models/                         # Data models
│   ├── user_model.py              # User schema
│   └── question_model.py          # Question schema
└── utils/                          # Utility functions
    ├── validators.py              # Input validation
    ├── response_handler.py        # API response formatting
    ├── jwt_helper.py              # JWT token management
    ├── password_helper.py         # Password hashing
    ├── auth_middleware.py         # Authentication middleware
    └── rate_limiter.py            # Rate limiting logic
```

## Setup Instructions

### 1. Create Virtual Environment

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update with your Azure credentials:

```powershell
cp .env.example .env
```

Required variables:
- `SECRET_KEY`: JWT signing secret
- `COSMOS_ENDPOINT`: Azure Cosmos DB endpoint
- `COSMOS_KEY`: Azure Cosmos DB access key
- `BLOB_CONNECTION_STRING`: Azure Storage connection string

### 4. Run the Application

```powershell
python app.py
```

Server will start at `http://localhost:5000`

## API Endpoints

### Authentication (`/auth`)

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and receive JWT token

### Student (`/student`)

- `POST /student/question` - Post a question with optional media
- `GET /student/questions` - Get all questions
- `GET /student/question/<id>` - Get specific question

### Teacher (`/teacher`)

- `GET /teacher/questions` - Get all questions (with optional filtering)
- `POST /teacher/answer/<questionId>` - Add answer to a question
- `DELETE /teacher/answer/<answerId>` - Delete own answer

### Admin (`/admin`)

- `GET /admin/all` - Get all questions and users
- `DELETE /admin/question/<id>` - Delete any question
- `POST /admin/create-teacher` - Create teacher account
- `POST /admin/create-student` - Create student account

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limits

- Students: 10 questions per day
- Teachers: 5 answers per minute

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token expiration (15 minutes default)
- Role-based access control (RBAC)
- Input validation and sanitization
- Secure file upload handling
- Cross-partition query optimization

## Azure Services Required

1. **Azure Cosmos DB** (NoSQL API)
   - Database: `peerviewdb`
   - Containers: `users`, `questions`

2. **Azure Blob Storage**
   - Container: `media`

## Deployment

For Azure App Service deployment:

1. Set environment variables in App Service Configuration
2. Enable "Always On" setting
3. Configure GitHub Actions for CI/CD
4. Add application logging integration

## Error Handling

The API returns standardized JSON responses:

```json
{
  "success": true/false,
  "message": "Description",
  "data": {}
}
```

## License

Proprietary - All rights reserved
