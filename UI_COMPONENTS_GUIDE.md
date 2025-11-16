# PeerView UI Components Quick Reference

## 🎨 Component Library

### Authentication Components

#### LoginForm
```tsx
<LoginForm />
```
**Features:**
- Email & password inputs
- Password visibility toggle
- Auto-redirect for authenticated users
- Role-based navigation
- Error handling
- Loading states

#### RegisterForm
```tsx
<RegisterForm />
```
**Features:**
- Name, email, password inputs
- Password visibility toggle
- Role selector (Student/Teacher)
- Module selector (Students only)
- Validation with error messages
- Success redirect

---

### Layout Components

#### MainLayout
```tsx
<MainLayout>
  <YourContent />
</MainLayout>
```
**Features:**
- 3-column Telegram-style layout
- Persistent sidebar
- Mobile responsive
- Profile drawer integration
- Navigation menu
- Bottom mobile nav

#### ProfileDrawer
```tsx
<ProfileDrawer isOpen={true} onClose={() => {}} />
```
**Features:**
- Slide-in from right
- User information display
- Activity stats
- Module chips
- Background overlay
- Smooth animations

---

### Feed Components

#### QuestionComposer
```tsx
<QuestionComposer 
  onSubmit={handleSubmit}
  isLoading={false}
/>
```
**Features:**
- Expandable interface
- Title & description inputs
- Module selector
- Media upload
- Validation
- Auto-clear on success

#### QuestionCard
```tsx
<QuestionCard question={questionData} />
```
**Features:**
- User avatar
- Module color tags
- Timestamp
- Title & description preview
- Media preview
- Answer count
- Click to navigate

---

### UI Components

#### Avatar
```tsx
<Avatar name="John Doe" size="sm" | "md" | "lg" | "xl" />
```

#### Badge
```tsx
<Badge variant="student" | "teacher" | "admin" | "default">
  Label
</Badge>
```

#### Button
```tsx
<Button 
  variant="primary" | "secondary" | "ghost" | "danger"
  size="sm" | "md" | "lg"
  isLoading={false}
  disabled={false}
>
  Click Me
</Button>
```

#### Input
```tsx
<Input
  label="Email"
  type="email"
  value={value}
  onChange={handleChange}
  error="Error message"
  placeholder="Enter email"
/>
```

#### TextArea
```tsx
<TextArea
  label="Description"
  value={value}
  onChange={handleChange}
  rows={4}
  error="Error message"
/>
```

#### Select
```tsx
<Select
  label="Module"
  value={value}
  onChange={handleChange}
  options={[
    { value: 'COM101', label: 'COM101' },
    { value: 'COM205', label: 'COM205' }
  ]}
/>
```

#### Modal
```tsx
<Modal
  isOpen={true}
  onClose={handleClose}
  title="Modal Title"
  size="sm" | "md" | "lg"
>
  <ModalBody>
    Content
  </ModalBody>
  <ModalFooter>
    <Button>Action</Button>
  </ModalFooter>
</Modal>
```

---

## 🎨 Color Palette

### Primary Colors
```css
--primary: #2AABEE;        /* Telegram Blue */
--primary-hover: #2A9FDB;  /* Hover state */
--primary-light: #8BCFFF;  /* Light variant */
```

### Module Colors
```css
--module-com101: #3B82F6;  /* Blue */
--module-com205: #8B5CF6;  /* Purple */
--module-com301: #10B981;  /* Green */
--module-com405: #F59E0B;  /* Orange */
--module-com501: #EF4444;  /* Red */
--module-com682: #6366F1;  /* Indigo */
```

### Background Colors
```css
/* Light Mode */
--bg-light: #e4e9ec;
--card-light: #ffffff;
--hover-light: #f4f4f5;
--border-light: #e7e7e7;

/* Dark Mode */
--bg-dark: #0e0e0e;
--card-dark: #212121;
--hover-dark: #2f2f2f;
--border-dark: #2f2f2f;
```

### Text Colors
```css
/* Light Mode */
--text-primary-light: #000000;
--text-secondary-light: #707579;

/* Dark Mode */
--text-primary-dark: #ffffff;
--text-secondary-dark: #aaaaaa;
```

---

## 📐 Spacing System

```css
/* Padding/Margin Scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

---

## 🔤 Typography

```css
/* Font Sizes */
--text-xs: 0.6875rem;   /* 11px */
--text-sm: 0.8125rem;   /* 13px */
--text-base: 0.9375rem; /* 15px */
--text-lg: 1.0625rem;   /* 17px */
--text-xl: 1.25rem;     /* 20px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 🎭 Animation Classes

```css
/* Fade In */
.animate-fade-in {
  animation: fadeIn 0.2s ease-in-out;
}

/* Slide In from Right */
.animate-slide-in-right {
  animation: slideInRight 0.3s ease-in-out;
}

/* Transition Classes */
.transition-colors {
  transition: color 0.15s ease-in-out;
}

.transition-all {
  transition: all 0.15s ease-in-out;
}
```

---

## 🧩 Layout Patterns

### Card Layout
```tsx
<div className="bg-white dark:bg-[#212121] rounded-2xl shadow-sm p-4">
  {/* Content */}
</div>
```

### List Item (Telegram Style)
```tsx
<div className="border-b border-[#e7e7e7] dark:border-[#2f2f2f] px-4 py-3 hover:bg-[#f4f4f5] dark:hover:bg-[#1a1a1a]">
  {/* Content */}
</div>
```

### Button Group
```tsx
<div className="flex gap-2 justify-end">
  <Button variant="ghost">Cancel</Button>
  <Button variant="primary">Submit</Button>
</div>
```

### Header Bar
```tsx
<div className="bg-white dark:bg-[#212121] border-b border-[#e7e7e7] dark:border-[#2f2f2f] px-4 py-3">
  {/* Header content */}
</div>
```

### Chat Bubble (Answer)
```tsx
<div className="flex items-start gap-2">
  <Avatar name="Teacher" size="sm" />
  <div className="bg-[#2AABEE] text-white rounded-2xl rounded-tl-sm px-3 py-2">
    <p className="text-[14px]">Answer text</p>
  </div>
</div>
```

---

## 📱 Responsive Utilities

```css
/* Mobile First Approach */
/* Base styles are mobile */

/* Tablet and up */
@media (min-width: 768px) {
  .md\:visible { display: block; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .lg\:visible { display: block; }
  .lg\:ml-80 { margin-left: 20rem; }
}
```

---

## 🎯 Usage Examples

### Creating a New Page
```tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

export const MyPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-[20px] font-medium text-black dark:text-white mb-4">
        Page Title
      </h1>
      {/* Content */}
    </div>
  );
};
```

### Adding a Modal
```tsx
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm">
  <ModalBody>
    <p>Are you sure?</p>
  </ModalBody>
  <ModalFooter>
    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```

### Using Toast Notifications
```tsx
import { useToast } from '../context/ToastContext';

const { showToast } = useToast();

// Success
showToast('success', 'Operation completed!');

// Error
showToast('error', 'Something went wrong');

// Info
showToast('info', 'Information message');

// Warning
showToast('warning', 'Warning message');
```

---

## 🔐 Protected Routes

```tsx
// In App.tsx
<Route
  path="/teacher"
  element={
    <ProtectedRoute allowedRoles={['teacher']}>
      <MainLayout>
        <TeacherDashboard />
      </MainLayout>
    </ProtectedRoute>
  }
/>
```

---

## 📊 State Management Patterns

### Component State
```tsx
const [data, setData] = useState<DataType[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Form State
```tsx
const [formData, setFormData] = useState({
  title: '',
  description: '',
  module: ''
});

const [errors, setErrors] = useState<Record<string, string>>({});
```

### API Call Pattern
```tsx
const fetchData = async () => {
  try {
    setLoading(true);
    const result = await api.getData();
    setData(result);
  } catch (error) {
    const err = error as AxiosError<{ error?: string }>;
    showToast('error', err.response?.data?.error || 'Failed to load');
  } finally {
    setLoading(false);
  }
};
```

---

## 🎨 Custom CSS Classes

### Telegram-Style Classes
```css
/* Button */
.tg-button-primary {
  background: #2AABEE;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
}

/* Input */
.tg-input {
  border: 1px solid #e7e7e7;
  border-radius: 8px;
  padding: 10px 12px;
}

/* Card */
.tg-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

/* Navigation Item */
.tg-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background 0.15s;
}

.tg-nav-item.active {
  background: #e4e9ec;
}
```

---

**Last Updated**: November 16, 2025
