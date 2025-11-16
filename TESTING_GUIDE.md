# PeerView UI Testing Guide

## 🧪 Testing Checklist

### Pre-Testing Setup

1. **Start the Backend Server**
   ```powershell
   cd c:\Users\shahe\Desktop\cloud\PeerView
   python run.py
   ```

2. **Start the Frontend Development Server**
   ```powershell
   cd c:\Users\shahe\Desktop\cloud\PeerView\frontend
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:5173`

---

## 🔐 SCREEN 1: Login Page Testing

### Test Cases

#### TC1.1: Valid Login
1. Navigate to `/login`
2. Enter valid email: `student@test.com`
3. Enter valid password
4. Click eye icon - verify password becomes visible
5. Click eye icon again - verify password is hidden
6. Click "Log In" button
7. ✅ Verify: Redirected to feed page
8. ✅ Verify: Toast shows "Login successful!"

#### TC1.2: Invalid Credentials
1. Enter invalid email
2. Enter password
3. Click "Log In"
4. ✅ Verify: Error message displayed
5. ✅ Verify: Remains on login page

#### TC1.3: Auto-Redirect
1. Login successfully
2. Navigate to `/login` again
3. ✅ Verify: Automatically redirected based on role
   - Student → `/`
   - Teacher → `/teacher`
   - Admin → `/admin`

#### TC1.4: Form Validation
1. Click "Log In" with empty fields
2. ✅ Verify: "Email is required" error shown
3. ✅ Verify: "Password is required" error shown
4. Enter invalid email format (e.g., "test")
5. ✅ Verify: "Invalid email format" error shown

---

## 📝 SCREEN 2: Registration Testing

### Test Cases

#### TC2.1: Student Registration
1. Navigate to `/register`
2. Enter name: "John Student"
3. Enter email: `john@student.com`
4. Enter strong password
5. Click eye icon - verify visibility toggle works
6. Select Role: "Student"
7. ✅ Verify: Module selector appears
8. Select modules: COM101, COM205, COM682
9. ✅ Verify: Selected modules have blue background
10. Click "Register"
11. ✅ Verify: Success toast appears
12. ✅ Verify: Redirected to login after 1.5 seconds

#### TC2.2: Teacher Registration
1. Fill in name and email
2. Enter password
3. Select Role: "Teacher"
4. ✅ Verify: Module selector is NOT shown
5. Click "Register"
6. ✅ Verify: Registration successful

#### TC2.3: Validation Errors
1. Try to submit with empty name
2. ✅ Verify: "Name is required" error
3. Try weak password (e.g., "test")
4. ✅ Verify: Password strength error shown
5. For student, don't select any modules
6. ✅ Verify: "Please select at least one module" error

#### TC2.4: Module Selection
1. Register as student
2. Click COM101 - ✅ Verify: Blue background, checkmark
3. Click COM101 again - ✅ Verify: Deselected
4. Select multiple modules
5. ✅ Verify: All selections persist

---

## 🏠 SCREEN 3: Main Layout Testing

### Test Cases

#### TC3.1: Desktop Layout
1. Login as student
2. ✅ Verify: Sidebar visible on left
3. ✅ Verify: User profile card shows at top of sidebar
4. ✅ Verify: Avatar displays with initials
5. ✅ Verify: Role badge shows "student"
6. ✅ Verify: Navigation items visible
7. Click Feed - ✅ Verify: Active highlight
8. Click profile card - ✅ Verify: Profile drawer opens

#### TC3.2: Mobile Layout
1. Resize browser to mobile width (< 768px)
2. ✅ Verify: Sidebar hidden
3. ✅ Verify: Hamburger menu visible
4. Click hamburger - ✅ Verify: Sidebar slides in
5. ✅ Verify: Bottom navigation bar visible
6. Click outside sidebar - ✅ Verify: Sidebar closes

#### TC3.3: Role-Based Navigation
1. Login as student
2. ✅ Verify: "Feed" and "My Questions" visible
3. ✅ Verify: Teacher/Admin options NOT visible
4. Logout, login as teacher
5. ✅ Verify: "Teacher Dashboard" visible
6. Logout, login as admin
7. ✅ Verify: "Admin Panel" visible

#### TC3.4: Search Bar
1. ✅ Verify: Search input in sidebar
2. Click search field
3. ✅ Verify: Can type in search
4. ✅ Verify: Focus styles apply

---

## ✍️ SCREEN 4: Question Composer Testing

### Test Cases

#### TC4.1: Expand/Collapse
1. Login as student
2. Navigate to feed
3. ✅ Verify: Composer shows "Ask a question..."
4. Click composer
5. ✅ Verify: Expands with smooth animation
6. ✅ Verify: Title, description, module, media fields visible
7. Click "Cancel"
8. ✅ Verify: Collapses back to single line

#### TC4.2: Post Question
1. Expand composer
2. Enter title: "How to use Azure Blob?"
3. Enter description: "I'm trying to upload a file..."
4. Select module: COM682
5. Click "Post Question"
6. ✅ Verify: Loading state on button
7. ✅ Verify: Success toast appears
8. ✅ Verify: Composer auto-clears
9. ✅ Verify: New question appears at top of feed
10. ✅ Verify: Composer collapses

#### TC4.3: Media Upload
1. Expand composer
2. Click "Attach Media"
3. Select an image file
4. ✅ Verify: File preview shows with filename
5. ✅ Verify: Remove button (X) appears
6. Click remove button
7. ✅ Verify: File cleared

#### TC4.4: Validation
1. Click "Post Question" with empty fields
2. ✅ Verify: Post button is disabled
3. Enter only title
4. ✅ Verify: Still disabled
5. Enter title and description
6. ✅ Verify: Still disabled
7. Select module
8. ✅ Verify: Button becomes enabled

---

## 📋 SCREEN 5: Feed Cards Testing

### Test Cases

#### TC5.1: Card Display
1. View feed
2. For each question card, verify:
   - ✅ Avatar with student initials
   - ✅ Student name
   - ✅ Module tag with color
   - ✅ Timestamp (e.g., "2h ago")
   - ✅ Question title (bold)
   - ✅ Description preview (2 lines max)
   - ✅ Answer count with icon
   - ✅ "View Thread" button

#### TC5.2: Module Colors
1. ✅ Verify each module has unique color:
   - COM101: Blue
   - COM205: Purple
   - COM301: Green
   - COM405: Orange
   - COM501: Red
   - COM682: Indigo

#### TC5.3: Media Preview
1. Find question with image
2. ✅ Verify: Image displays with rounded corners
3. ✅ Verify: Image doesn't exceed max height
4. Find question with video
5. ✅ Verify: Video thumbnail shows

#### TC5.4: Interactions
1. Hover over card
2. ✅ Verify: Background changes to hover color
3. Click anywhere on card
4. ✅ Verify: Navigates to thread page
5. Click "View Thread" specifically
6. ✅ Verify: Same navigation

---

## 💬 SCREEN 6: Thread Page Testing

### Test Cases

#### TC6.1: Question Display
1. Click on a question
2. ✅ Verify: Header shows student name, avatar
3. ✅ Verify: Module and timestamp in header
4. ✅ Verify: Question title in large font
5. ✅ Verify: Full description visible
6. ✅ Verify: Media displays if present
7. ✅ Verify: Back button works

#### TC6.2: Media Viewer
1. Open thread with image
2. Click on image
3. ✅ Verify: Full-screen modal opens
4. ✅ Verify: Image centered and enlarged
5. ✅ Verify: Close button visible
6. Click close button or background
7. ✅ Verify: Modal closes

#### TC6.3: Answer Bubbles
1. View thread with answers
2. For each answer, verify:
   - ✅ Avatar on left
   - ✅ Blue bubble background (#2AABEE)
   - ✅ Teacher name and badge
   - ✅ Answer text in white
   - ✅ Timestamp below bubble
   - ✅ Bubble has rounded corners

#### TC6.4: Answer Composer (Teacher)
1. Login as teacher
2. Open a thread
3. ✅ Verify: Answer composer visible at bottom
4. ✅ Verify: Textarea and send button present
5. Type an answer
6. Press Enter
7. ✅ Verify: Answer submits
8. ✅ Verify: New answer appears immediately
9. ✅ Verify: Auto-scroll to bottom
10. ✅ Verify: Textarea clears

#### TC6.5: Answer Composer (Student)
1. Login as student
2. Open a thread
3. ✅ Verify: Answer composer NOT visible
4. ✅ Verify: Only teachers can answer

#### TC6.6: Auto-Scroll
1. Open thread with many answers
2. Post new answer as teacher
3. ✅ Verify: Smooth scroll to bottom
4. ✅ Verify: New answer visible

---

## 👨‍💼 SCREEN 7: Admin Dashboard Testing

### Test Cases

#### TC7.1: Statistics Cards
1. Login as admin
2. Navigate to `/admin`
3. ✅ Verify: 4 stat cards displayed
   - Total Questions
   - Total Answers
   - Total Users
   - Active Modules
4. ✅ Verify: Each has icon and number
5. ✅ Verify: Colors match theme

#### TC7.2: Users Table
1. View users table
2. ✅ Verify: Columns: Name, Email, Role, Joined, Actions
3. ✅ Verify: Role badges display correctly
4. ✅ Verify: Dates formatted properly
5. ✅ Verify: Delete button on each row

#### TC7.3: Questions Table
1. View questions table
2. ✅ Verify: Columns: Title, Student, Module, Created, Actions
3. ✅ Verify: Title truncates if too long
4. ✅ Verify: Module badges display
5. ✅ Verify: Delete button on each row

#### TC7.4: Delete User
1. Click delete on a user
2. ✅ Verify: Confirmation modal opens
3. ✅ Verify: Warning message displayed
4. Click "Cancel"
5. ✅ Verify: Modal closes, no deletion
6. Click delete again
7. Click "Delete" in modal
8. ✅ Verify: Loading state
9. ✅ Verify: Success toast
10. ✅ Verify: User removed from table

#### TC7.5: Delete Question
1. Click delete on a question
2. Follow same steps as user deletion
3. ✅ Verify: Question removed from table

---

## 👤 SCREEN 8: Profile Drawer Testing

### Test Cases

#### TC8.1: Open/Close
1. Login
2. Click user profile card in sidebar
3. ✅ Verify: Drawer slides in from right
4. ✅ Verify: Background overlay appears
5. ✅ Verify: Smooth animation
6. Click background overlay
7. ✅ Verify: Drawer closes
8. Open again, click X button
9. ✅ Verify: Drawer closes

#### TC8.2: Profile Information
1. Open profile drawer
2. ✅ Verify: Large avatar (XL size)
3. ✅ Verify: User name displayed
4. ✅ Verify: Email displayed
5. ✅ Verify: Role badge visible

#### TC8.3: Modules (Student)
1. Login as student
2. Open profile drawer
3. ✅ Verify: "MODULES" section visible
4. ✅ Verify: Module chips displayed
5. ✅ Verify: Chips have colored background

#### TC8.4: Modules (Teacher)
1. Login as teacher
2. Open profile drawer
3. ✅ Verify: Modules section NOT displayed

#### TC8.5: Activity Stats
1. Open profile drawer
2. ✅ Verify: "ACTIVITY" section visible
3. ✅ Verify: Questions count with icon
4. ✅ Verify: Answers count with icon
5. ✅ Verify: Numbers display correctly

#### TC8.6: Edit Profile Button
1. ✅ Verify: "Edit Profile" button visible
2. ✅ Verify: Blue background (#2AABEE)
3. Click button
4. ✅ Verify: Console log (placeholder action)

---

## 🔄 FLOW TESTING

### Authentication Flow

#### AF1: Complete Login Flow
1. Start at `/login`
2. Enter credentials
3. Submit
4. ✅ Verify: JWT stored in localStorage
5. ✅ Verify: User context updated
6. ✅ Verify: Redirected based on role
7. Refresh page
8. ✅ Verify: Still logged in

#### AF2: Session Expiration
1. Login successfully
2. Manually delete token from localStorage
3. Navigate to a protected route
4. ✅ Verify: Redirected to login
5. ✅ Verify: Error message shown

#### AF3: Logout Flow
1. Login
2. Click "Logout" in sidebar
3. ✅ Verify: Token removed from localStorage
4. ✅ Verify: User context cleared
5. ✅ Verify: Redirected to login

---

### Posting Flow

#### PF1: Complete Question Post
1. Login as student
2. Expand composer
3. Fill all fields
4. Upload media
5. Submit
6. ✅ Verify: Loading state
7. ✅ Verify: Success toast
8. ✅ Verify: Question appears in feed
9. ✅ Verify: Composer clears and collapses
10. Click on new question
11. ✅ Verify: All data saved correctly

#### PF2: Post with Media
1. Create question with image
2. Submit
3. ✅ Verify: Image appears in feed card
4. Open thread
5. ✅ Verify: Full image displays
6. Click image
7. ✅ Verify: Media viewer opens

---

### Answering Flow

#### ANF1: Teacher Answer
1. Login as teacher
2. Navigate to any question
3. Type answer in composer
4. Press Enter
5. ✅ Verify: Answer posts immediately
6. ✅ Verify: Appears as blue bubble
7. ✅ Verify: Auto-scrolls to bottom
8. ✅ Verify: Textarea clears
9. ✅ Verify: Teacher badge shows

#### ANF2: Multiple Answers
1. Post first answer
2. Wait 2 seconds
3. Post second answer
4. ✅ Verify: Both display in order
5. ✅ Verify: Timestamps different
6. ✅ Verify: Auto-scroll works each time

---

## 🎨 UI/UX TESTING

### Responsiveness

#### R1: Desktop (>1024px)
1. Set browser width to 1440px
2. ✅ Verify: Sidebar always visible
3. ✅ Verify: Main content centered
4. ✅ Verify: All elements properly spaced

#### R2: Tablet (768px-1024px)
1. Set browser width to 800px
2. ✅ Verify: Layout adjusts
3. ✅ Verify: Sidebar collapsible
4. ✅ Verify: Touch targets appropriate

#### R3: Mobile (<768px)
1. Set browser width to 375px
2. ✅ Verify: Single column layout
3. ✅ Verify: Sidebar hidden by default
4. ✅ Verify: Bottom navigation visible
5. ✅ Verify: All content accessible

---

### Dark Mode

#### DM1: Toggle Dark Mode
1. Check system dark mode preference
2. ✅ Verify: App respects system setting
3. ✅ Verify: All colors invert properly
4. ✅ Verify: Text readable in both modes
5. ✅ Verify: No color contrast issues

---

### Animations

#### A1: Smooth Transitions
1. Expand/collapse composer
2. ✅ Verify: Smooth animation
3. Open/close profile drawer
4. ✅ Verify: Slide animation smooth
5. Navigate between pages
6. ✅ Verify: Fade-in animation
7. Hover over cards
8. ✅ Verify: Color transition smooth

---

## 🐛 Edge Cases Testing

### EC1: Empty States
- ✅ Feed with no questions
- ✅ Thread with no answers
- ✅ Admin with no users/questions

### EC2: Long Content
- ✅ Very long question title
- ✅ Very long description
- ✅ Many answers (50+)
- ✅ Long user names

### EC3: Network Errors
- ✅ Failed API calls
- ✅ Timeout errors
- ✅ Server errors (500)

### EC4: Validation Boundaries
- ✅ Maximum title length
- ✅ Maximum description length
- ✅ Special characters in input
- ✅ Multiple file uploads

---

## ✅ Final Checklist

Before considering testing complete, verify:

- [ ] All 8 screens functional
- [ ] All authentication flows work
- [ ] All CRUD operations work
- [ ] All role-based access works
- [ ] Responsive on all screen sizes
- [ ] Dark mode works properly
- [ ] All animations smooth
- [ ] No console errors
- [ ] All forms validate properly
- [ ] All error states handled
- [ ] All loading states present
- [ ] All toast notifications work
- [ ] Browser back/forward works
- [ ] Refresh preserves auth state
- [ ] All links navigate correctly

---

## 📊 Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🎯 Performance Checklist

- [ ] Initial load < 3 seconds
- [ ] Page transitions < 500ms
- [ ] API calls return < 2 seconds
- [ ] Images load progressively
- [ ] No layout shifts
- [ ] Smooth scrolling (60fps)
- [ ] No memory leaks
- [ ] Optimized bundle size

---

**Testing Status**: Ready for QA
**Last Updated**: November 16, 2025
