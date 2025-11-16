# PeerView Frontend - Visual Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         🎓 PEERVIEW FRONTEND                                 │
│                    Modern Q&A Platform for Students & Teachers               │
└─────────────────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════════════╗
║                            🔐 AUTH SCREENS                                 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌─────────────────────┐        ┌─────────────────────┐                  ║
║  │   LOGIN SCREEN      │        │  REGISTER SCREEN    │                  ║
║  │                     │        │                     │                  ║
║  │  📧 Email           │        │  👤 Name            │                  ║
║  │  🔒 Password [👁]   │        │  📧 Email           │                  ║
║  │                     │        │  🔒 Password [👁]   │                  ║
║  │  [ LOG IN ]         │        │  🎭 Role ▼          │                  ║
║  │                     │        │  ☑ Modules (if 👨‍🎓)  │                  ║
║  │  Register here →    │        │  [ REGISTER ]       │                  ║
║  │                     │        │  ← Login instead    │                  ║
║  └─────────────────────┘        └─────────────────────┘                  ║
║                                                                            ║
║  ✅ Password visibility toggle                                            ║
║  ✅ Auto-redirect if logged in                                            ║
║  ✅ Role-based routing                                                    ║
║  ✅ Form validation                                                       ║
║  ✅ Module selector for students                                          ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║                         📱 MAIN APPLICATION                                ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌────────────┬──────────────────────────────────────────┬──────────────┐ ║
║  │  SIDEBAR   │           MAIN FEED                      │   (DRAWER)   │ ║
║  │            │                                          │              │ ║
║  │ ┌────────┐ │  ┌────────────────────────────────────┐ │              │ ║
║  │ │ Avatar │ │  │ [➕ Ask a question...]              │ │              │ ║
║  │ │ Name   │ │  └────────────────────────────────────┘ │              │ ║
║  │ │ 🎓 Badge│ │                                          │              │ ║
║  │ └────────┘ │  ┌────────────────────────────────────┐ │              │ ║
║  │            │  │ 👤 John Doe    🔵 COM682  2h ago   │ │              │ ║
║  │ 🔍 Search  │  │ How to use Azure Blob Storage?     │ │              │ ║
║  │            │  │ I'm trying to upload files but...  │ │              │ ║
║  │ 📋 Feed    │  │ [📷 Image Preview]                  │ │              │ ║
║  │ ❓ My Q's  │  │ 💬 3 Answers   View Thread →       │ │              │ ║
║  │ 👨‍🏫 Teacher │  └────────────────────────────────────┘ │              │ ║
║  │            │                                          │              │ ║
║  │ ⚙️ Settings │  ┌────────────────────────────────────┐ │              │ ║
║  │ 🚪 Logout  │  │ 👤 Jane Smith  🟣 COM205  5h ago   │ │              │ ║
║  │            │  │ Question about data structures...  │ │              │ ║
║  └────────────┘  └────────────────────────────────────┘ │              │ ║
║                                                          │              │ ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║                      💬 QUESTION THREAD (CHAT STYLE)                       ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │ ← 👤 John Doe     🔵 COM682 • 2h ago                                 │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │ How to use Azure Blob Storage?                                       │ ║
║  │                                                                       │ ║
║  │ I'm trying to upload a file but getting errors. Can someone help?   │ ║
║  │                                                                       │ ║
║  │ [📷 Click to view image]                                             │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ───────────────── 2 ANSWERS ─────────────────                            ║
║                                                                            ║
║  👨‍🏫 ┌──────────────────────────────────────────┐                          ║
║     │ Prof. Smith  🏫 Teacher                   │                          ║
║     │ You need to create a SAS token first.    │                          ║
║     │ Here's how...                             │                          ║
║     └──────────────────────────────────────────┘                          ║
║     1h ago                                                                ║
║                                                                            ║
║  👨‍🏫 ┌──────────────────────────────────────────┐                          ║
║     │ Dr. Johnson  🏫 Teacher                   │                          ║
║     │ Also make sure your connection string    │                          ║
║     │ is configured correctly.                  │                          ║
║     └──────────────────────────────────────────┘                          ║
║     30m ago                                                               ║
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │ [Your answer...                                        ] [📤 Send]    │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║                         👤 PROFILE DRAWER                                  ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║         [Slides in from right]                                            ║
║                                                                            ║
║         ┌──────────────────────┐                                          ║
║         │  Profile        [✕]  │                                          ║
║         ├──────────────────────┤                                          ║
║         │                      │                                          ║
║         │      ┌────────┐      │                                          ║
║         │      │   👤   │      │                                          ║
║         │      │  Avatar│      │                                          ║
║         │      └────────┘      │                                          ║
║         │                      │                                          ║
║         │    John Doe          │                                          ║
║         │  john@student.com    │                                          ║
║         │    🎓 Student        │                                          ║
║         │                      │                                          ║
║         │  MODULES             │                                          ║
║         │  [COM101] [COM205]   │                                          ║
║         │  [COM682]            │                                          ║
║         │                      │                                          ║
║         │  ACTIVITY            │                                          ║
║         │  ❓ Questions: 12    │                                          ║
║         │  💬 Answers: 3       │                                          ║
║         │                      │                                          ║
║         │  [ Edit Profile ]    │                                          ║
║         │                      │                                          ║
║         └──────────────────────┘                                          ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════╗
║                         👨‍💼 ADMIN DASHBOARD                                 ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌──────────────┬──────────────┬──────────────┬──────────────┐           ║
║  │ Questions    │   Answers    │    Users     │   Modules    │           ║
║  │     125      │      342     │      89      │       6      │           ║
║  │     📊       │      ✅      │      👥      │      📚      │           ║
║  └──────────────┴──────────────┴──────────────┴──────────────┘           ║
║                                                                            ║
║  ┌────────────────────────────────────────────────────────────┐           ║
║  │ ALL USERS                                                  │           ║
║  ├────────────┬──────────────┬────────┬──────────┬──────────┤           ║
║  │ Name       │ Email        │ Role   │ Joined   │ Actions  │           ║
║  ├────────────┼──────────────┼────────┼──────────┼──────────┤           ║
║  │ John Doe   │ john@...     │ 🎓 Std │ Nov 1    │ [Delete] │           ║
║  │ Jane Smith │ jane@...     │ 👨‍🏫 Tcr │ Oct 15   │ [Delete] │           ║
║  └────────────┴──────────────┴────────┴──────────┴──────────┘           ║
║                                                                            ║
║  ┌────────────────────────────────────────────────────────────┐           ║
║  │ ALL QUESTIONS                                              │           ║
║  ├──────────────────┬────────┬────────┬──────────┬──────────┤           ║
║  │ Title            │ Student│ Module │ Created  │ Actions  │           ║
║  ├──────────────────┼────────┼────────┼──────────┼──────────┤           ║
║  │ How to use...    │ John   │ COM682 │ 2h ago   │ [Delete] │           ║
║  │ Question about...│ Jane   │ COM205 │ 5h ago   │ [Delete] │           ║
║  └──────────────────┴────────┴────────┴──────────┴──────────┘           ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## 🎨 KEY VISUAL FEATURES

### 🌈 Module Color System
```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ COM101   │ COM205   │ COM301   │ COM405   │ COM501   │ COM682   │
│  🔵 Blue │ 🟣 Purple│ 🟢 Green │ 🟠 Orange│ 🔴 Red   │ 🟣 Indigo│
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

### 💭 Answer Bubble Styles
```
Teacher Answers:
┌────────────────────────────┐
│ 👨‍🏫 Prof. Smith  🏫 Teacher │  ← Blue background (#2AABEE)
│ Your answer here...        │  ← White text
└────────────────────────────┘
2h ago                          ← Gray timestamp
```

### 🎭 Role Badges
```
┌─────────┬───────────┬──────────┐
│ 🎓 STD  │ 👨‍🏫 TEACH │ 👨‍💼 ADMIN │
│  Blue   │   Purple  │    Red   │
└─────────┴───────────┴──────────┘
```

---

## 📐 LAYOUT STRUCTURE

### Desktop (>1024px)
```
┌────────────────────────────────────────────────────┐
│                    PeerView                        │
├───────────┬────────────────────────────────────────┤
│           │                                        │
│  SIDEBAR  │         MAIN CONTENT                   │
│  (Fixed)  │         (Scrollable)                   │
│           │                                        │
│  280px    │         Flexible Width                 │
│           │                                        │
│  ▪ User   │  ▪ Question Composer (if student)     │
│  ▪ Nav    │  ▪ Feed / Thread / Dashboard          │
│  ▪ Search │  ▪ Cards / Tables / Forms              │
│           │                                        │
└───────────┴────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌────────────────────────────────────────┐
│  [☰] PeerView                          │ ← Header
├────────────────────────────────────────┤
│                                        │
│         MAIN CONTENT                   │
│         (Full Width)                   │
│                                        │
│  ▪ Question Composer                   │
│  ▪ Feed / Thread / Dashboard           │
│  ▪ Cards / Tables / Forms              │
│                                        │
├────────────────────────────────────────┤
│  [🏠]  [❓]  [👤]  [⚙️]              │ ← Bottom Nav
└────────────────────────────────────────┘
```

---

## 🎬 ANIMATION SHOWCASE

### Composer Expand/Collapse
```
Collapsed:  [➕ Ask a question...]

             ↓ Click

Expanded:   ┌─────────────────────────────┐
            │ Title: [____________]        │
            │ Description: [_________]     │
            │ Module: [COM682 ▼]          │
            │ Media: [📎 Attach]          │
            │ [Cancel] [Post Question]    │
            └─────────────────────────────┘
```

### Profile Drawer Animation
```
Closed:     │ Main Content
            │
            │

            ↓ Click Profile

Open:       │ Main Content    ┌──────────┐
            │                 │ Profile  │
            │                 │ Drawer   │
                              └──────────┘
                              Slides in →
```

### Thread Auto-Scroll
```
Question + Answers
│
├─ Answer 1
├─ Answer 2
└─ Answer 3
    ↓
[New Answer Posted]
    ↓
Smooth scroll ⤵
    ↓
└─ Answer 4 ★ (visible)
```

---

## 🎯 INTERACTION PATTERNS

### Card Click → Thread
```
Feed Card               Thread View
┌──────────────┐       ┌──────────────────────┐
│ Question     │       │ ← Question Title     │
│ Preview      │ ───→  │                      │
│ 💬 3 Answers │       │ Full Description     │
└──────────────┘       │                      │
   Click!              │ [Answers Below]      │
                       └──────────────────────┘
```

### Composer Flow
```
1. Click           2. Fill Form        3. Submit
┌──────────┐      ┌──────────┐       ┌──────────┐
│ Ask Q... │  →   │ Title    │   →   │ Loading..│
└──────────┘      │ Desc     │       └──────────┘
                  │ Module   │              ↓
                  │ [Post]   │       4. Success
                  └──────────┘       ┌──────────┐
                                     │ Posted!  │
                                     │ ✅ Toast │
                                     └──────────┘
                                            ↓
                                     5. Appears
                                     ┌──────────┐
                                     │ New Q    │
                                     │ in Feed  │
                                     └──────────┘
```

---

## 🌓 DARK MODE TRANSFORMATION

### Light Mode
```
Background: #e4e9ec (Light gray)
Cards:      #ffffff (White)
Text:       #000000 (Black)
Secondary:  #707579 (Gray)
```

### Dark Mode
```
Background: #0e0e0e (Almost black)
Cards:      #212121 (Dark gray)
Text:       #ffffff (White)
Secondary:  #aaaaaa (Light gray)
```

---

## 📊 COMPONENT HIERARCHY

```
App
├── AuthProvider
│   ├── LoginForm ✅
│   └── RegisterForm ✅
│
├── ProtectedRoute
│   └── MainLayout ✅
│       ├── Sidebar ✅
│       │   ├── UserProfile ✅
│       │   ├── SearchBar ✅
│       │   └── Navigation ✅
│       │
│       ├── ProfileDrawer ✅
│       │
│       └── Pages
│           ├── FeedPage ✅
│           │   ├── QuestionComposer ✅
│           │   └── QuestionCard[] ✅
│           │
│           ├── QuestionDetailPage ✅
│           │   ├── QuestionHeader ✅
│           │   ├── AnswerBubble[] ✅
│           │   ├── MediaViewer ✅
│           │   └── AnswerComposer ✅
│           │
│           ├── AdminDashboard ✅
│           │   ├── StatCards ✅
│           │   ├── UsersTable ✅
│           │   ├── QuestionsTable ✅
│           │   └── DeleteModal ✅
│           │
│           └── TeacherDashboard ✅
│
└── ToastProvider ✅
    └── Toast ✅
```

---

**All visual components have been implemented with:**
- ✅ Telegram-inspired design
- ✅ Smooth animations
- ✅ Responsive layouts
- ✅ Dark mode support
- ✅ Accessibility features
- ✅ Modern UX patterns

**Status:** 🎉 100% Complete and Ready for Production!
