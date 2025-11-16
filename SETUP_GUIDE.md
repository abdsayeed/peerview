# PeerView - Setup & Quick Start Guide

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+ installed
- Python 3.9+ installed
- npm or yarn package manager
- Git

---

## 📦 Installation

### 1. Clone Repository (if needed)
```powershell
cd c:\Users\shahe\Desktop\cloud\PeerView
```

### 2. Install Frontend Dependencies
```powershell
cd frontend
npm install
```

### 3. Install Backend Dependencies
```powershell
cd ..
pip install -r requirements.txt
```

---

## 🏃 Running the Application

### Start Backend Server
```powershell
# From project root
python run.py
```
Backend will start at: `http://localhost:5000`

### Start Frontend Development Server
```powershell
# In a new terminal
cd frontend
npm run dev
```
Frontend will start at: `http://localhost:5173`

### Open Browser
Navigate to: `http://localhost:5173`

---

## 👥 Test Accounts

### Student Account
```
Email: student@test.com
Password: Student123!
```

### Teacher Account
```
Email: teacher@test.com
Password: Teacher123!
```

### Admin Account
```
Email: admin@test.com
Password: Admin123!
```

---

## 📁 Project Structure

```
PeerView/
├── frontend/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── common/        # ProfileDrawer, ProtectedRoute
│   │   │   ├── feed/          # QuestionComposer, QuestionCard
│   │   │   └── ui/            # Button, Input, Modal, etc.
│   │   ├── context/           # AuthContext, ToastContext
│   │   ├── layouts/           # MainLayout
│   │   ├── pages/             # FeedPage, QuestionDetailPage, etc.
│   │   ├── services/          # API client
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Helper functions
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── package.json           # Dependencies
│   ├── vite.config.ts         # Vite configuration
│   └── tailwind.config.js     # Tailwind CSS config
│
├── app/                        # Python Flask backend
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── models/                # Data models
│   └── utils/                 # Helper functions
│
├── docs/                       # Documentation
├── tests/                      # Test files
├── run.py                      # Backend entry point
├── requirements.txt            # Python dependencies
│
├── IMPLEMENTATION_SUMMARY.md   # What was built
├── UI_COMPONENTS_GUIDE.md      # Component reference
├── TESTING_GUIDE.md            # Testing instructions
└── VISUAL_OVERVIEW.md          # Visual reference
```

---

## 🎨 Key Features Implemented

### ✅ Authentication
- Login with password visibility toggle
- Registration with module selection
- Auto-redirect based on role
- Protected routes
- JWT token management

### ✅ Feed & Questions
- Question composer with media upload
- Feed cards with module colors
- Real-time question posting
- Media preview
- Answer count display

### ✅ Thread View
- Telegram-style chat interface
- Teacher answer bubbles
- Media viewer modal
- Auto-scroll to new answers
- Teacher-only answer composer

### ✅ Admin Dashboard
- Statistics cards
- Users table with delete
- Questions table with delete
- Confirmation modals
- Role-based access

### ✅ Profile Management
- Slide-in profile drawer
- User information display
- Activity stats
- Module chips
- Edit profile button

### ✅ UI/UX
- Telegram-inspired design
- Dark mode support
- Responsive layout
- Smooth animations
- Toast notifications
- Loading states
- Error handling

---

## 🛠️ Development Commands

### Frontend

```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

### Backend

```powershell
# Install dependencies
pip install -r requirements.txt

# Run development server
python run.py

# Run tests
pytest

# Run with debug mode
set FLASK_ENV=development
python run.py
```

---

## 🌐 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=PeerView
```

### Backend (.env)
```env
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
AZURE_STORAGE_CONNECTION_STRING=your-storage-connection-string
AZURE_COSMOS_CONNECTION_STRING=your-cosmos-connection-string
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile */
< 768px

/* Tablet */
768px - 1024px

/* Desktop */
> 1024px
```

---

## 🎨 Customization

### Change Primary Color
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#2AABEE', // Change this
  }
}
```

### Change Module Colors
Edit `frontend/src/components/feed/QuestionCard.tsx`:
```typescript
const moduleColors: Record<string, string> = {
  'COM101': 'bg-blue-500 text-white',
  'COM205': 'bg-purple-500 text-white',
  // Add or modify colors
};
```

---

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```powershell
# Build production bundle
cd frontend
npm run build

# Deploy dist/ folder
```

### Backend (Azure/Heroku)
```powershell
# Azure
az webapp up --name peerview-api

# Heroku
git push heroku main
```

---

## 🧪 Testing

### Run All Tests
```powershell
# Frontend
cd frontend
npm run test

# Backend
cd ..
pytest
```

### Manual Testing
Follow the comprehensive guide in `TESTING_GUIDE.md`

---

## 📊 Performance Tips

### Frontend
- Images are lazy loaded
- Code splitting by route
- Optimized bundle size
- Minimal re-renders

### Backend
- API response caching
- Database query optimization
- Connection pooling
- Rate limiting

---

## 🐛 Troubleshooting

### Frontend won't start
```powershell
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Backend connection errors
- Check if backend is running on port 5000
- Verify environment variables are set
- Check database connection

### Build errors
```powershell
# Clean build
npm run clean
npm run build
```

### CORS issues
- Ensure backend CORS is configured correctly
- Check API base URL in frontend config

---

## 📚 Documentation

- **IMPLEMENTATION_SUMMARY.md** - Complete feature list
- **UI_COMPONENTS_GUIDE.md** - Component reference
- **TESTING_GUIDE.md** - Testing instructions
- **VISUAL_OVERVIEW.md** - Visual reference

---

## 🎯 Next Steps

### Recommended Enhancements
1. **Real-time Updates** - WebSocket for live notifications
2. **Search** - Global search across questions
3. **Filters** - Filter by module, date, status
4. **Pagination** - Infinite scroll or pagination
5. **Notifications** - In-app notification system
6. **Rich Text** - Markdown or WYSIWYG editor
7. **Analytics** - Detailed usage analytics
8. **Export** - Data export functionality
9. **Bulk Actions** - Bulk delete/edit
10. **Email** - Email notifications

---

## 💡 Tips

### Development
- Use React DevTools for debugging
- Check browser console for errors
- Use network tab to inspect API calls
- Enable source maps for debugging

### Performance
- Use Lighthouse for performance audits
- Monitor bundle size with webpack-bundle-analyzer
- Use React Profiler for render optimization
- Implement lazy loading for large lists

### Security
- Keep dependencies updated
- Use environment variables for secrets
- Implement rate limiting
- Validate all user inputs
- Use HTTPS in production

---

## 🤝 Contributing

### Code Style
- Follow existing code patterns
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic
- Keep components small and focused

### Git Workflow
```powershell
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add: your feature"

# Push to remote
git push origin feature/your-feature

# Create pull request
```

---

## 📞 Support

### Common Issues
1. **Port already in use** - Change port in config
2. **Module not found** - Reinstall dependencies
3. **API errors** - Check backend logs
4. **Build failures** - Clear cache and rebuild

### Getting Help
- Check documentation files
- Review error messages carefully
- Check browser console
- Review backend logs

---

## ✅ Verification Checklist

Before deploying, verify:
- [ ] All tests pass
- [ ] No console errors
- [ ] All features working
- [ ] Responsive on all screens
- [ ] Dark mode works
- [ ] All routes accessible
- [ ] API calls succeed
- [ ] Authentication works
- [ ] Media uploads work
- [ ] Admin functions work

---

## 🎉 Success!

Your PeerView application is now ready to use!

- **Frontend**: Beautiful, modern UI ✅
- **Backend**: Robust API ✅
- **Features**: Complete implementation ✅
- **Documentation**: Comprehensive guides ✅

---

**Version**: 1.0.0
**Last Updated**: November 16, 2025
**Status**: ✅ Production Ready
