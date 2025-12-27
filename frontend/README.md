# OpportunityHub 🚀

**OpportunityHub** is a comprehensive platform that helps students and professionals discover and track opportunities including hackathons, tech events, college fests, internships, and jobs. The platform features AI-powered resume analysis, personalized recommendations, and deadline tracking.

## 📁 Project Structure

```
Opportunity_Hub/
├── opportunityhub_frontend/          # Main project directory
│   ├── opportunityhub_backend/       # Backend (Node.js + Express)
│   │   ├── routes/                   # API routes
│   │   ├── services/                 # Business logic
│   │   ├── server.js                 # Express server
│   │   └── package.json              # Backend dependencies
│   │
│   ├── src/                          # Frontend (React + TypeScript)
│   │   ├── components/               # React components
│   │   ├── pages/                    # Page components
│   │   ├── services/                 # Frontend API services
│   │   └── lib/                      # Utilities and configs
│   │
│   ├── README.md                     # This file
│   ├── WALKTHROUGH.md                # Implementation walkthrough
│   └── package.json                  # Frontend dependencies
```

## ✨ Features

### 1. **User Preferences**
- **Domain Preferences**: Select your areas of interest (Web Development, AI/ML, Data Science, etc.)
- **Location Preferences**: Choose your preferred location or work remotely
- Personalized opportunity feed based on your preferences

### 2. **Opportunity Discovery**
- Browse hackathons, tech events, college fests, internships, and jobs
- Advanced filtering by type, domain, and location
- Real-time search functionality
- Detailed opportunity information including deadlines, stipends, and requirements

### 3. **AI-Powered Resume Analysis**
- Upload resume (PDF, JPG, or PNG) or paste text
- AI-powered analysis using Google Gemini
- **Match Percentage**: See how well your resume matches job descriptions
- **Skill Comparison**: View matched vs. missing skills
- **AI Suggestions**: Get personalized recommendations for:
  - Skills to learn
  - Projects to build
  - Resume improvements
- **Opportunity Recommendations**: Discover relevant opportunities based on your skills

### 4. **Wishlist & Deadline Management**
- Save opportunities to your wishlist
- Track upcoming deadlines with countdown
- Urgent deadline alerts (< 7 days)
- Sort opportunities by deadline urgency
- Visual deadline calendar

### 5. **Smart Notifications**
- Deadline reminders for wishlisted opportunities
- Urgent opportunity alerts
- New opportunity notifications based on preferences

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **Firebase SDK** for authentication and database

### Backend
- **Node.js** with Express
- **Firebase Admin SDK** for server-side operations
- **Google Gemini AI** for resume analysis
- **Multer** for file uploads
- **PDF-Parse** for PDF text extraction
- **Tesseract.js** for OCR (image-based resumes)

### Database
- **Firebase Firestore** for data storage
- **Firebase Storage** for resume file storage
- **Firebase Authentication** for user management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase Account** (for database and authentication)
- **Google Gemini API Key** (for AI-powered resume analysis)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd opportunityhub_frontend
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Firebase Authentication** (Email/Password)
4. Create a **Firestore Database**
5. Enable **Firebase Storage**
6. Download your service account key:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `firebaseKey.json` in `opportunityhub_backend/`

### 3. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Save it for the next step

### 4. Environment Configuration

#### Frontend Environment Variables

Create `.env` in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:8000
```

#### Backend Environment Variables

Create `.env` in `opportunityhub_backend/`:

```bash
cd opportunityhub_backend
cp .env.example .env
```

Edit `opportunityhub_backend/.env`:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./firebaseKey.json
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
FRONTEND_URL=http://localhost:5173
```

### 5. Install Dependencies

#### Frontend Dependencies

```bash
npm install
```

#### Backend Dependencies

```bash
cd opportunityhub_backend
npm install
cd ..
```

### 6. Initialize Firestore Database

Create the following collections in your Firestore database:

1. **users** - User profiles and preferences
2. **opportunities** - All available opportunities
3. **wishlists** - User wishlists
4. **resumeAnalyses** - Resume analysis history

You can add sample opportunities manually or use the Firebase console.

### 7. Run the Application

#### Start Backend Server

```bash
cd opportunityhub_backend
npm start
```

The backend will run on `http://localhost:8000`

#### Start Frontend Development Server

In a new terminal:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 8. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📖 Documentation

- **[WALKTHROUGH.md](./WALKTHROUGH.md)** - Complete implementation walkthrough with all features explained
- **[Backend README](./opportunityhub_backend/README.md)** - Backend-specific documentation (if needed)

## 🔥 Firebase Collections Schema

### users
```typescript
{
  uid: string;
  email: string;
  displayName: string;
  location: string;
  domain: string[];  // User's preferred domains
  createdAt: Timestamp;
  onboardingCompleted: boolean;
}
```

### opportunities
```typescript
{
  id: string;
  title: string;
  organization: string;
  type: 'hackathon' | 'tech-event' | 'college-fest' | 'internship' | 'job';
  location: string;
  deadline: Timestamp;
  domains: string[];
  description: string;
  stipend?: string;
  duration?: string;
  reward?: string;
  isRemote: boolean;
  createdAt: Timestamp;
}
```

### wishlists
```typescript
{
  userId: string;
  opportunities: {
    [opportunityId]: {
      addedAt: Timestamp;
      deadline: Timestamp;
      title: string;
      type: string;
    }
  }
}
```

### resumeAnalyses
```typescript
{
  userId: string;
  analyses: [{
    id: string;
    resumeText: string;
    jobDescription: string;
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    suggestions: {
      skills: string[];
      projects: string[];
      improvements: string[];
    };
    recommendations: Opportunity[];
    analyzedAt: Timestamp;
  }]
}
```

## 🎯 API Endpoints

### Opportunities
- `GET /opportunities` - Fetch opportunities with filters
- `GET /opportunities/:id` - Get single opportunity
- `POST /opportunities/wishlist` - Add to wishlist
- `DELETE /opportunities/wishlist/:userId/:opportunityId` - Remove from wishlist
- `GET /opportunities/wishlist/:userId` - Get user's wishlist

### Resume Analysis
- `POST /resume/upload` - Upload and parse resume
- `POST /resume/analyze` - Analyze resume vs job description
- `GET /resume/history/:userId` - Get analysis history
- `POST /resume/suggestions` - Get opportunity recommendations

### Deadlines
- `GET /deadlines/:userId` - Get upcoming deadlines
- `GET /deadlines/:userId/urgent` - Get urgent deadlines
- `GET /deadlines/:userId/stats` - Get deadline statistics

## 🎨 Key Features Walkthrough

### 1. User Onboarding
1. Sign up with email/password
2. Select location preference
3. Choose domain interests
4. Preferences saved to Firestore

### 2. Browse Opportunities
1. View personalized feed based on preferences
2. Filter by type, domain, location
3. Search by keywords
4. Add to wishlist

### 3. Resume Analysis
1. Upload resume or paste text
2. Paste job description
3. AI analyzes and provides:
   - Match percentage
   - Matched/missing skills
   - Improvement suggestions
   - Relevant opportunities

### 4. Track Deadlines
1. View wishlisted opportunities
2. See countdown to deadlines
3. Urgent alerts for deadlines < 7 days
4. Sort by urgency

## 🔧 Development

### Build for Production

```bash
npm run build
```

### Run Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Verify `.env` variables are correct
   - Check Firebase project settings
   - Ensure Firestore and Authentication are enabled

2. **Gemini API Error**
   - Verify API key is valid
   - Check API quota limits
   - Ensure billing is enabled (if required)

3. **Backend Not Starting**
   - Check if port 8000 is available
   - Verify `firebaseKey.json` exists
   - Check backend `.env` configuration

4. **Resume Upload Failing**
   - Check file size (max 10MB)
   - Verify file type (PDF, JPG, PNG only)
   - Check Firebase Storage rules

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using React, Firebase, and Google Gemini AI**
