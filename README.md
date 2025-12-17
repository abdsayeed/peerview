# PeerView - Multimedia Q&A Platform

A modern web application that enables students to ask questions with multimedia attachments and receive answers from instructors. Built with Angular frontend and Flask backend, integrated with Azure Cloud services.

## 🚀 Features

### Core Functionality
- **Question Posting**: Students can submit questions with text descriptions and multimedia attachments (images, videos, audio)
- **Answer System**: Teachers can provide detailed text responses with optional multimedia attachments
- **Media Support**: Full support for images (JPG, PNG, GIF), videos (MP4, WebM), and audio files (MP3, WAV, OGG)
- **Real-time Feed**: Dynamic question feed with status indicators (answered/pending)

### User Management
- **Role-based Authentication**: Three user roles - Student, Teacher, Admin
- **JWT Token Security**: Secure authentication with JSON Web Tokens
- **User Registration**: Self-registration for students, admin-managed accounts for teachers
- **Profile Management**: User profile viewing and management

### Administrative Features
- **Admin Dashboard**: System statistics and user management
- **Content Moderation**: Flag and remove inappropriate content
- **User Activity Tracking**: Monitor user engagement and activity
- **System Analytics**: View platform usage statistics

## 🏗️ Architecture

### Frontend (Angular 17)
- **Framework**: Angular 17 with standalone components
- **Styling**: SCSS with custom CSS variables and responsive design
- **State Management**: Service-based architecture with RxJS
- **Routing**: Angular Router with role-based guards
- **HTTP Client**: Angular HttpClient with interceptors

### Backend (Flask)
- **Framework**: Flask with modular service architecture
- **Authentication**: JWT-based authentication with role-based access control
- **API Design**: RESTful API with versioned endpoints
- **Middleware**: Custom authentication and authorization middleware
- **File Handling**: Azure Blob Storage integration for media files

### Cloud Services (Azure)
- **Database**: Azure Cosmos DB for document storage
- **File Storage**: Azure Blob Storage for multimedia files
- **Monitoring**: Azure Application Insights for telemetry and performance monitoring
- **Automation**: Azure Logic Apps for workflow automation and business processes
- **Security**: Azure-managed keys and connection strings
- **Scalability**: Cloud-native architecture for horizontal scaling

## 📁 Project Structure

```
PeerView/
├── backend/
│   ├── middleware/
│   │   ├── __init__.py
│   │   └── auth_middleware.py      # JWT authentication middleware
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py                 # User data models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── admin_service.py        # Admin functionality
│   │   ├── auth_service.py         # Authentication logic
│   │   ├── blob_service.py         # Azure Blob Storage
│   │   └── cosmos_service.py       # Azure Cosmos DB
│   ├── .env                        # Environment variables
│   ├── .env.example               # Environment template
│   ├── app.py                     # Main Flask application
│   └── requirements.txt           # Python dependencies
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/         # Angular components
    │   │   ├── models/            # TypeScript interfaces
    │   │   ├── services/          # Angular services
    │   │   └── app.component.ts   # Root component
    │   ├── environments/          # Environment configurations
    │   └── styles.scss           # Global styles
    ├── angular.json              # Angular configuration
    ├── package.json              # Node dependencies
    ├── proxy.conf.json           # Development proxy
    └── tsconfig.json             # TypeScript configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Azure Account** with Cosmos DB and Blob Storage services

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update with your Azure credentials:
   ```env
   # Azure Cosmos DB Configuration
   AZURE_COSMOS_URI=your_cosmos_uri
   AZURE_COSMOS_KEY=your_cosmos_key
   AZURE_COSMOS_DB_NAME=your_database_name
   AZURE_COSMOS_CONTAINER_NAME=Questions

   # Azure Blob Storage Configuration
   AZURE_BLOB_CONNECTION_STRING=your_blob_connection_string
   AZURE_BLOB_CONTAINER_NAME=media
   AZURE_STORAGE_ACCOUNT_NAME=your_storage_account
   AZURE_STORAGE_ACCOUNT_KEY=your_storage_key

   # Application Configuration
   JWT_SECRET=your_jwt_secret_key
   FLASK_ENV=development
   FLASK_DEBUG=True
   ```

4. **Start the Flask server**:
   ```bash
   python app.py
   ```
   Server runs on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the Angular development server**:
   ```bash
   npm start
   ```
   Application runs on `http://localhost:4200`

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
- `AZURE_COSMOS_URI`: Azure Cosmos DB endpoint URL
- `AZURE_COSMOS_KEY`: Azure Cosmos DB primary key
- `AZURE_COSMOS_DB_NAME`: Database name in Cosmos DB
- `AZURE_COSMOS_CONTAINER_NAME`: Container name for questions
- `AZURE_BLOB_CONNECTION_STRING`: Azure Blob Storage connection string
- `AZURE_BLOB_CONTAINER_NAME`: Container name for media files
- `AZURE_STORAGE_ACCOUNT_NAME`: Storage account name
- `AZURE_STORAGE_ACCOUNT_KEY`: Storage account access key
- `JWT_SECRET`: Secret key for JWT token generation
- `FLASK_ENV`: Flask environment (development/production)
- `FLASK_DEBUG`: Enable/disable Flask debug mode
- `APPINSIGHTS_INSTRUMENTATION_KEY`: Azure Application Insights instrumentation key
- `AZURE_LOGIC_APP_URL`: Azure Logic Apps workflow trigger URL
- `AZURE_LOGIC_APP_KEY`: Azure Logic Apps access key

#### Frontend (environments/)
- `production`: Set to false for development
- `apiUrl`: Backend API URL (empty for proxy in development)

### Proxy Configuration
The frontend uses Angular's proxy configuration (`proxy.conf.json`) to route API calls to the backend during development:

```json
{
  "/api/*": {
    "target": "http://localhost:5001",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  },
  "/v1/*": {
    "target": "http://localhost:5001",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/v1/auth/register`
- **Body**: `{ "email": "string", "password": "string", "fullName": "string" }`
- **Response**: `{ "user": {...}, "token": "string" }`

#### Login User
- **POST** `/v1/auth/login`
- **Body**: `{ "email": "string", "password": "string" }`
- **Response**: `{ "user": {...}, "token": "string" }`

#### Get Current User
- **GET** `/v1/users/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "id": "string", "email": "string", "fullName": "string", "role": "string" }`

### Question Endpoints

#### Get Questions Feed
- **GET** `/v1/questions?page=1&limit=20`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of question objects

#### Create Question
- **POST** `/v1/questions`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "title": "string", "caption": "string", "mediaUrl": "string", "mediaType": "string" }`
- **Response**: Question object

#### Get Question by ID
- **GET** `/v1/questions/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Question object with answers

#### Delete Question
- **DELETE** `/v1/questions/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

### Answer Endpoints

#### Add Answer to Question
- **POST** `/v1/questions/{id}/answers`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "textResponse": "string", "mediaUrl": "string" }`
- **Response**: Answer object

#### Update Answer
- **PUT** `/v1/answers/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "textResponse": "string", "mediaUrl": "string" }`
- **Response**: Updated answer object

#### Delete Answer
- **DELETE** `/v1/answers/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

### Media Endpoints

#### Upload File
- **POST** `/api/upload`
- **Body**: FormData with file
- **Response**: `{ "url": "string" }`

#### Get Media File
- **GET** `/api/media/{filename}`
- **Response**: Binary file data

### Admin Endpoints

#### Get System Statistics
- **GET** `/v1/admin/stats`
- **Headers**: `Authorization: Bearer <token>` (Admin only)
- **Response**: System statistics object

#### Moderate Content
- **POST** `/v1/admin/moderation`
- **Headers**: `Authorization: Bearer <token>` (Admin only)
- **Body**: `{ "targetType": "string", "targetId": "string", "action": "string" }`
- **Response**: Moderation result

## 🎨 User Interface

### Design System
- **Color Palette**: Professional blue and gray theme
- **Typography**: Inter font family for modern readability
- **Components**: Consistent button, card, and form styling
- **Responsive**: Mobile-first design with breakpoints
- **Accessibility**: WCAG compliant color contrast and navigation

### Key Components
- **Feed Component**: Displays questions with multimedia content
- **Upload Component**: File upload with drag-and-drop support
- **Question Detail**: Full question view with answers
- **Admin Dashboard**: System management interface
- **Authentication**: Login and registration forms

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-based Access**: Student, Teacher, Admin permissions
- **Password Hashing**: Secure password storage with bcrypt
- **Token Expiration**: Configurable token lifetime

### Data Protection
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content sanitization
- **CORS Configuration**: Controlled cross-origin requests

### File Security
- **File Type Validation**: Restricted file types for uploads
- **Size Limits**: Maximum file size enforcement
- **Secure Storage**: Azure Blob Storage with access controls
- **Media Proxy**: Controlled access to uploaded files

## 🚀 Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
```
Builds the app for production to the `dist/` folder.

#### Backend
```bash
cd backend
# Set environment variables for production
export FLASK_ENV=production
export FLASK_DEBUG=False
python app.py
```

### Environment Configuration
- Update `frontend/src/environments/environment.prod.ts` with production API URL
- Configure production Azure services
- Set secure JWT secret and other sensitive variables
- Enable HTTPS for production deployment

### Recommended Hosting
- **Frontend**: Azure Static Web Apps, Netlify, or Vercel
- **Backend**: Azure App Service, AWS Elastic Beanstalk, or Heroku
- **Database**: Azure Cosmos DB (already configured)
- **Storage**: Azure Blob Storage (already configured)

## 🛠️ Development

### Code Structure
- **Modular Architecture**: Separated concerns with services and components
- **TypeScript**: Full type safety in frontend
- **Python Type Hints**: Type annotations in backend services
- **Error Handling**: Comprehensive error handling and logging
- **Code Quality**: Consistent formatting and linting

### Development Workflow
1. Start backend server: `cd backend && python app.py`
2. Start frontend server: `cd frontend && npm start`
3. Access application at `http://localhost:4200`
4. API available at `http://localhost:5001`

### Key Development Features
- **Hot Reload**: Automatic refresh on code changes
- **Proxy Configuration**: Seamless API calls during development
- **Error Logging**: Detailed error messages and stack traces
- **Debug Mode**: Enhanced debugging capabilities

## 📝 Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  lastLogin?: string;
}
```

### Question Model
```typescript
interface Question {
  id: string;
  userId: string;
  title: string;
  caption: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'audio';
  timestamp: string;
  status: 'pending' | 'answered';
  answers: Answer[];
}
```

### Answer Model
```typescript
interface Answer {
  answerId: string;
  userId: string;
  textResponse: string;
  mediaUrl?: string;
  timestamp: string;
}
```

## 🤝 Contributing

### Development Guidelines
1. Follow existing code style and conventions
2. Write descriptive commit messages
3. Test all changes thoroughly
4. Update documentation for new features
5. Ensure responsive design for UI changes

### Code Style
- **Frontend**: Angular style guide with Prettier formatting
- **Backend**: PEP 8 Python style guide
- **Naming**: Descriptive variable and function names
- **Comments**: Clear documentation for complex logic

## 📄 License

This project is developed for educational purposes. Please ensure compliance with your institution's policies and applicable laws when deploying or modifying this application.

## 🆘 Support

For issues, questions, or contributions:
1. Check existing documentation
2. Review error logs in browser console and server output
3. Verify Azure service configuration
4. Ensure all environment variables are properly set

## 🔄 Version History

- **v1.0.0**: Initial release with core Q&A functionality
- **v1.1.0**: Added multimedia support and Azure integration
- **v1.2.0**: Enhanced admin features and content moderation
- **v1.3.0**: Improved UI/UX and responsive design
- **v1.4.0**: Production-ready with security enhancements

---

**PeerView** - Empowering educational communication through multimedia Q&A platform.