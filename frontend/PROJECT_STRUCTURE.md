# OpportunityHub - Project Structure

This document explains the organization of the OpportunityHub project.

## 📁 Current Structure

```
Opportunity_Hub/
└── opportunityhub_frontend/          # Main project directory
    ├── opportunityhub_backend/       # Backend (Node.js + Express)
    │   ├── routes/                   # API routes
    │   │   ├── auth.js               # Authentication routes
    │   │   ├── opportunities.js      # Opportunity CRUD operations
    │   │   ├── resume.js             # Resume analysis endpoints
    │   │   └── deadlines.js          # Deadline tracking endpoints
    │   │
    │   ├── services/                 # Business logic
    │   │   ├── opportunityService.js # Opportunity operations
    │   │   ├── resumeService.js      # AI-powered resume analysis
    │   │   └── deadlineService.js    # Deadline calculations
    │   │
    │   ├── server.js                 # Express server entry point
    │   ├── package.json              # Backend dependencies
    │   ├── .env.example              # Backend environment template
    │   ├── .env                      # Backend environment (gitignored)
    │   ├── .gitignore                # Backend gitignore
    │   └── firebaseKey.json          # Firebase service account (gitignored)
    │
    ├── src/                          # Frontend (React + TypeScript)
    │   ├── components/               # React components
    │   │   ├── Navbar.tsx
    │   │   ├── OpportunityCard.tsx
    │   │   ├── FiltersSidebar.tsx
    │   │   ├── UpcomingDeadlines.tsx
    │   │   └── ui/                   # shadcn/ui components
    │   │
    │   ├── pages/                    # Page components
    │   │   ├── Landing.tsx           # Landing page
    │   │   ├── SignUp.tsx            # Sign up page
    │   │   ├── Login.tsx             # Login page
    │   │   ├── Onboarding.tsx        # User onboarding
    │   │   ├── Home.tsx              # Main dashboard
    │   │   ├── ResumeAnalysis.tsx    # AI resume analysis
    │   │   ├── Wishlist.tsx          # Wishlist with deadlines
    │   │   └── Profile.tsx           # User profile
    │   │
    │   ├── services/                 # Frontend API services
    │   │   ├── opportunityService.ts # Opportunity API calls
    │   │   └── resumeService.ts      # Resume API calls
    │   │
    │   ├── lib/                      # Utilities and configs
    │   │   ├── firebase.ts           # Firebase configuration
    │   │   ├── auth-context.tsx      # Authentication context
    │   │   ├── firestore-schema.ts   # Database schema types
    │   │   ├── mock-data.ts          # Sample data
    │   │   └── utils.ts              # Utility functions
    │   │
    │   ├── hooks/                    # Custom React hooks
    │   ├── App.tsx                   # Main app component
    │   ├── main.tsx                  # Entry point
    │   └── vite-env.d.ts             # Vite environment types
    │
    ├── public/                       # Static assets
    ├── .env                          # Frontend environment (gitignored)
    ├── .env.example                  # Frontend environment template
    ├── package.json                  # Frontend dependencies
    ├── vite.config.ts                # Vite configuration
    ├── tailwind.config.ts            # Tailwind configuration
    ├── tsconfig.json                 # TypeScript configuration
    ├── README.md                     # Main documentation
    └── WALKTHROUGH.md                # Implementation walkthrough
```

## 📚 Documentation Files

### Root Level Documentation
- **[README.md](./README.md)** - Main project documentation with setup instructions
- **[WALKTHROUGH.md](./WALKTHROUGH.md)** - Complete implementation walkthrough

### Backend Documentation
- **[opportunityhub_backend/.env.example](./opportunityhub_backend/.env.example)** - Backend environment variables template

### Frontend Documentation
- **[.env.example](./.env.example)** - Frontend environment variables template

## 🚀 Running the Project

### Backend Server
```bash
cd opportunityhub_backend
npm install
npm start
```
Runs on: `http://localhost:8000`

### Frontend Development Server
```bash
npm install
npm run dev
```
Runs on: `http://localhost:5173`

## 🔑 Key Directories

### Backend (`opportunityhub_backend/`)
- **routes/** - Express route handlers for API endpoints
- **services/** - Business logic and Firebase operations
- **server.js** - Main Express server with middleware and route configuration

### Frontend (`src/`)
- **components/** - Reusable React components
- **pages/** - Page-level components for routing
- **services/** - API communication layer
- **lib/** - Utilities, configurations, and context providers

## 🔥 Firebase Integration

The project uses Firebase for:
- **Authentication** - User sign up/login
- **Firestore** - Database for users, opportunities, wishlists, and resume analyses
- **Storage** - Resume file storage

## 🤖 AI Integration

The project uses Google Gemini AI for:
- Resume text analysis
- Skill matching
- Personalized suggestions
- Opportunity recommendations

## 📦 Dependencies

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- shadcn/ui (UI components)
- Firebase SDK
- React Router

### Backend
- Node.js + Express
- Firebase Admin SDK
- Google Gemini AI SDK
- Multer (file uploads)
- PDF-Parse (PDF parsing)
- Tesseract.js (OCR)

## 🔐 Environment Variables

### Frontend (`.env`)
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=http://localhost:8000
```

### Backend (`opportunityhub_backend/.env`)
```env
FIREBASE_SERVICE_ACCOUNT_PATH=./firebaseKey.json
GEMINI_API_KEY=
PORT=8000
FRONTEND_URL=http://localhost:5173
```

## 📝 Notes

- The backend is nested inside the frontend folder for simplicity
- Both frontend and backend have their own `package.json` and dependencies
- Environment files (`.env`) are gitignored for security
- Firebase service account key (`firebaseKey.json`) is gitignored

For detailed setup instructions, see [README.md](./README.md)
