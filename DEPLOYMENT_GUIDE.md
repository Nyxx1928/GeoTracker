# Deployment Guide - GitHub & Vercel

This guide will walk you through uploading your project to GitHub and deploying it to Vercel.

---

## 📋 Prerequisites

- Git installed on your computer ([Download Git](https://git-scm.com/downloads))
- GitHub account ([Sign up here](https://github.com/signup))
- Vercel account ([Sign up here](https://vercel.com/signup))

---

## 🚀 Part 1: Upload to GitHub

### Step 1: Initialize Git Repository (if not already done)

Open your terminal/command prompt in the project root directory (`JLabs3`) and run:

```bash
git init
```

### Step 2: Create .gitignore File

Create a `.gitignore` file in the root directory to exclude unnecessary files:

```gitignore
# Dependencies
node_modules/
frontend/node_modules/

# Build outputs
frontend/build/
frontend/.next/

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### Step 3: Stage and Commit Your Files

```bash
# Add all files
git add .

# Create your first commit
git commit -m "Initial commit: IP Geolocation App"
```

### Step 4: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `jlabs3-ip-geolocation` (or any name you prefer)
   - **Description**: "IP Geolocation App with React and Node.js"
   - **Visibility**: Select **"Public"** (required for submission)
   - **DO NOT** initialize with README, .gitignore, or license (we already have files)
5. Click **"Create repository"**

### Step 5: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/jlabs3-ip-geolocation.git

# Rename the default branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

You'll be prompted to enter your GitHub username and password (use a Personal Access Token if 2FA is enabled).

### Step 6: Verify Upload

1. Go to your GitHub repository page
2. You should see all your files uploaded
3. Make sure the repository is set to **Public**

---

## 🌐 Part 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Sign in to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** to connect your GitHub account

#### Step 2: Import Your Repository

1. Once logged in, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find and click **"Import"** next to your `jlabs3-ip-geolocation` repository

#### Step 3: Configure Project Settings

Vercel will auto-detect your project. Configure as follows:

**Root Directory:**
- Click **"Edit"** next to Root Directory
- Select `frontend` folder (since that's where your React app is)

**Framework Preset:**
- Should auto-detect as **"Create React App"**
- If not, select it manually

**Build Settings:**
- **Build Command**: `npm run build` (should be auto-filled)
- **Output Directory**: `build` (should be auto-filled)
- **Install Command**: `npm install` (should be auto-filled)

**Environment Variables:**
- For now, you can skip this (backend will be deployed separately)

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Once done, you'll get a URL like: `https://your-project-name.vercel.app`

#### Step 5: Deploy Backend (Separate Project)

Since your backend is in a separate folder, you'll need to deploy it separately:

1. Create a new project in Vercel
2. Import the same repository
3. This time, set **Root Directory** to `backend`
4. For backend, you might need to:
   - Add a `vercel.json` in the backend folder (see below)
   - Or use Vercel's serverless functions

**Create `backend/vercel.json`:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    }
  ]
}
```

**Note:** For the backend API to work, you'll need to:
- Update the frontend API URL from `http://localhost:8000` to your Vercel backend URL
- Or use environment variables

---

### Option B: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy Frontend

```bash
cd frontend
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No**
- Project name? `jlabs3-frontend` (or any name)
- Directory? `./`
- Override settings? **No**

#### Step 4: Deploy Backend

```bash
cd ../backend
vercel
```

---

## 🔧 Part 3: Update API URLs for Production

### Update Frontend to Use Production API

You need to update the API URL in your frontend to point to your deployed backend.

**Option 1: Use Environment Variables**

1. Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

2. Update `frontend/src/pages/Login.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const res = await axios.post(`${API_URL}/api/login`, { email, password });
```

3. Add to Vercel project settings:
   - Go to your Vercel project → Settings → Environment Variables
   - Add `REACT_APP_API_URL` with your backend URL

**Option 2: Update Directly in Code**

Update `frontend/src/pages/Login.js` line 14:
```javascript
// Change from:
const res = await axios.post('http://localhost:8000/api/login', { email, password });

// To:
const res = await axios.post('https://your-backend-url.vercel.app/api/login', { email, password });
```

---

## 📝 Part 4: Final Checklist

Before submitting:

- [ ] Code is uploaded to GitHub (public repository)
- [ ] Frontend is deployed to Vercel
- [ ] Backend is deployed to Vercel (or alternative)
- [ ] API URLs are updated for production
- [ ] Test the deployed application
- [ ] All features work correctly
- [ ] README.md is updated with deployment URLs

---

## 🐛 Troubleshooting

### Issue: Build fails on Vercel

**Solution:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Make sure Node.js version is compatible

### Issue: API calls fail in production

**Solution:**
- Check CORS settings in backend
- Verify API URL is correct
- Check browser console for errors
- Ensure backend is deployed and accessible

### Issue: GitHub push fails

**Solution:**
- Use Personal Access Token instead of password
- Enable 2FA and generate token: GitHub → Settings → Developer settings → Personal access tokens

---

## 📚 Additional Resources

- [GitHub Documentation](https://docs.github.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)

---

## ✅ Submission Checklist

When submitting your project:

1. **GitHub Repository:**
   - [ ] Repository is public
   - [ ] README.md includes setup instructions
   - [ ] All code is committed and pushed

2. **Vercel Deployment:**
   - [ ] Frontend is live and accessible
   - [ ] Backend API is working
   - [ ] All features are functional

3. **Documentation:**
   - [ ] README includes GitHub link
   - [ ] README includes Vercel deployment link
   - [ ] Setup instructions are clear

---

**Good luck with your submission! 🚀**

