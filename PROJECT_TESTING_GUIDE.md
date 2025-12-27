# Opportunity Hub: Setup and Testing Guide

Follow these steps to set up the environment and verify the project features.

## 🛠️ Step 1: Local Setup

### 1. Backend Setup
1. Open a terminal in `C:\Hackathon_final\backend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Environment**: Ensure `.env` exists with your `GEMINI_API_KEY` and `FIREBASE_PROJECT_ID`.
4. **Service Account**: Ensure `firebaseKey.json` is present in the `backend/` root (or path specified in `.env`).

### 2. Database Seeding (CRITICAL)
Populate your Firestore with real opportunities:
```bash
node seed.js
```

### 3. Frontend Setup
1. Open a terminal in `C:\Hackathon_final\frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. **Environment**: Ensure `.env` has `VITE_API_URL=http://localhost:8000`.

---

## 🚀 Step 2: Running the Servers

### Start Backend
In `C:\Hackathon_final\backend`:
```bash
npm run dev
```

### Start Frontend
In `C:\Hackathon_final\frontend`:
```bash
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173) or [http://localhost:5174](http://localhost:5174).

---

## 🧪 Step 3: Test Cases

### Test Case 1: Landing & New User Journey
1. Navigate to the [Landing Page](http://localhost:5174). (Use 5174 if 5173 is in use)
2. Click **Get Started**.
3. Fill in the **Signup** form (Email: `user1@test.com`, User: `student1`, Pass: `password123`).
4. **Result**: You should be redirected to the **Onboarding** page.
5. Select **Web Development** and **Remote**.
6. **Result**: You should land on the **Home** page and see "Frontend Developer Intern" with a high match score.

### Test Case 2: Opportunity Matching & Links
1. On the Home page, look at an opportunity card (e.g., Smart India Hackathon).
2. **Verify**: The **Match Score** (e.g., 85%) is visible.
3. Click the **Register Now** (or Apply Now) button.
4. **Result**: It should open the official website (e.g., sih.gov.in) in a new tab.

### Test Case 3: AI Resume Analysis
1. Navigate to the **Resume Analysis** tool from the sidebar or navbar.
2. Paste the text of a **React/Web Developer resume** in the left box.
3. Paste a **Full Stack Developer job description** in the right box.
4. Click **Analyze Resume Match**.
5. **Result**: 
   - A **Match Score** appears.
   - **Key Strengths** list your technical skills.
   - **Scope of Improvement** lists missing technologies or formatting tips.
   - **Projects Ideas** suggest what to build next.

### Test Case 4: Wishlist & Deadlines
1. On Home, click the **Bookmark icon** on 2-3 opportunities.
2. Observe the **Upcoming Deadlines** sidebar on the right.
3. **Result**: The wishlisted items should climb to the top of the sidebar with "X days left" highlighted in red for urgent ones.

### Test Case 5: Returning User
1. Logout from the profile menu.
2. Go to [Login](http://localhost:5173/login) and use your credentials.
3. **Result**: Your dashboard should automatically load with "Web Development" filtered and your wishlist intact.
