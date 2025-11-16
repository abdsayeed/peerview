# 🏗️ PeerView - Modular Flask Architecture

## ✨ What Changed?

Your Flask backend has been restructured into a **professional, modular architecture** following industry best practices!

### 🔄 Migration Summary

**Old Structure:**
```
PeerView/
├── app.py                    # Everything in one file
├── config.py
├── controllers/
├── models/
├── services/
└── utils/
```

**New Modular Structure:**
```
PeerView/
├── run.py                    # 🎯 Clean entry point
├── app/                      # 📦 Application package
│   ├── __init__.py          # Factory pattern
│   ├── config.py            # Environment configs
│   ├── routes/              # 🛣️ Blueprints (controllers)
│   │   ├── main.py
│   │   ├── auth.py
│   │   ├── student.py
│   │   ├── teacher.py
│   │   └── admin.py
│   ├── models/              # 📊 Data models
│   ├── services/            # 🔧 Business logic
│   └── utils/               # 🛠️ Helpers
└── tests/                   # 🧪 Test suite
```

---

## 🎯 Key Improvements

### 1️⃣ Application Factory Pattern
**File:** `app/__init__.py`

```python
def create_app(config_class=Config):
    app = Flask(__name__)
    # Configuration, blueprints, error handlers
    return app
```

**Benefits:**
- ✅ Multiple app instances for testing
- ✅ Environment-based configuration
- ✅ Better dependency injection
- ✅ Easier to test

### 2️⃣ Blueprint Architecture
**Before:** Monolithic routes in `app.py`
**Now:** Organized blueprints in `app/routes/`

```python
# app/routes/auth.py
bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=['POST'])
def register():
    # Registration logic
```

**Benefits:**
- ✅ Clear separation of concerns
- ✅ Each domain isolated
- ✅ Easy to add/remove features
- ✅ Better URL organization

### 3️⃣ Configuration Management
**File:** `app/config.py`

```python
class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
```

**Benefits:**
- ✅ Environment-specific settings
- ✅ Easy to switch configs
- ✅ Secure production settings

### 4️⃣ Clean Entry Point
**File:** `run.py`

```python
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

**Benefits:**
- ✅ Separation of app creation and running
- ✅ Easier to deploy (WSGI servers)
- ✅ Better for testing

---

## 🚀 How to Use

### Start Development Server
```bash
python run.py
```

### Start with Specific Environment
```bash
# Development (default)
python run.py

# Production
$env:FLASK_ENV="production"; python run.py

# Testing
$env:FLASK_ENV="testing"; python run.py
```

### Run Tests
```bash
python -m pytest tests/
```

---

## 📦 Package Structure Explained

### `app/__init__.py` - The Heart
- Creates Flask application
- Registers all blueprints
- Configures CORS
- Sets up error handlers
- Initializes services (Cosmos DB, Blob Storage)

### `app/routes/` - Controllers Layer
Each file is a **Blueprint** handling specific domain:

| File | Prefix | Purpose |
|------|--------|---------|
| `main.py` | `/` | Health check, API info |
| `auth.py` | `/auth` | Registration, login |
| `student.py` | `/student` | Question operations |
| `teacher.py` | `/teacher` | Answer operations |
| `admin.py` | `/admin` | Admin management |

### `app/models/` - Data Layer
- `user_model.py` - User schema & validation
- `question_model.py` - Question/Answer schemas

### `app/services/` - Business Logic
- `cosmos_service.py` - Database operations
- `blob_service.py` - File storage operations

### `app/utils/` - Helper Layer
- `auth_middleware.py` - JWT & RBAC decorators
- `jwt_helper.py` - Token generation/validation
- `password_helper.py` - Password hashing
- `validators.py` - Input validation
- `response_handler.py` - Standard responses
- `rate_limiter.py` - Rate limiting logic

---

## 🔥 Architecture Benefits

### Scalability
- Add new features by creating new blueprints
- Services are reusable across routes
- Easy to extend without breaking existing code

### Maintainability
- Clear structure = easy navigation
- Each file has single responsibility
- Changes are isolated to specific modules

### Testability
- Mock services independently
- Test blueprints in isolation
- Multiple app instances for testing

### Professional Standards
- Follows Flask recommended patterns
- Industry-standard project structure
- Easy for new developers to understand

---

## 🎨 Import Pattern

### Old Way ❌
```python
from config import Config
from models.user_model import UserModel
```

### New Way ✅
```python
from app.config import Config
from app.models.user_model import UserModel
```

**Why?**
- Explicit package imports
- No conflicts with system modules
- Clear module hierarchy

---

## 🧪 Testing Made Easy

```python
# tests/test_api.py
from app import create_app
from app.config import TestingConfig

def test_health_check():
    app = create_app(TestingConfig)
    client = app.test_client()
    
    response = client.get('/')
    assert response.status_code == 200
```

---

## 🔧 Adding New Features

### Example: Add Email Service

**1. Create service file**
```python
# app/services/email_service.py
class EmailService:
    def send_email(self, to, subject, body):
        # Email logic
```

**2. Create blueprint**
```python
# app/routes/notifications.py
from flask import Blueprint
from app.services.email_service import email_service

bp = Blueprint('notifications', __name__, url_prefix='/notifications')

@bp.route('/send', methods=['POST'])
def send_notification():
    # Logic
```

**3. Register blueprint**
```python
# app/__init__.py
from app.routes import notifications

app.register_blueprint(notifications.bp)
```

**Done!** ✅

---

## 📊 Comparison

| Aspect | Old Structure | New Structure |
|--------|--------------|---------------|
| Organization | Flat, scattered | Hierarchical, organized |
| Scalability | Limited | Excellent |
| Testing | Difficult | Easy |
| Deployment | Complex | Simple |
| Maintainability | Hard | Easy |
| Industry Standard | No | Yes |

---

## 🎯 Next Steps

1. ✅ **Structure Updated** - Done!
2. 🔜 Add Azure credentials to `.env`
3. 🔜 Run full integration tests
4. 🔜 Deploy to production

---

## 📚 Additional Resources

- [Flask Application Factories](https://flask.palletsprojects.com/en/latest/patterns/appfactories/)
- [Flask Blueprints](https://flask.palletsprojects.com/en/latest/blueprints/)
- [Project Structure Best Practices](https://flask.palletsprojects.com/en/latest/tutorial/layout/)

---

**Your backend is now production-ready with professional structure! 🚀**
