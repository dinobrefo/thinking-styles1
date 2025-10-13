# ThinkAlign Deployment Guide

## 🚀 Vercel Frontend Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign up/login
2. **Click "New Project"**
3. **Import from GitHub:**
   - Connect your GitHub account
   - Select `dinobrefo/thinking-styles1`
   - **Important**: Set Root Directory to `frontend`
4. **Configure build settings:**
   - Framework: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Node.js Version: `18.x`
5. **Add Environment Variables:**
   - `REACT_APP_API_URL`: `https://your-backend-url.railway.app/api`
   - `REACT_APP_ENVIRONMENT`: `production`
6. **Click "Deploy"**

### Option 2: Deploy via CLI

```bash
cd frontend
npx vercel
```

## 🔧 Backend Deployment Options

### Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub and select your repository
3. Set the backend folder as the root
4. Add environment variables

### Render
1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `cd backend && npm install && npm run build`

## 📋 Environment Variables

### Backend (.env)
```env
PORT=5001
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

### Frontend (Vercel Environment Variables)
```env
REACT_APP_API_URL=https://your-backend-url.railway.app/api
REACT_APP_ENVIRONMENT=production
```

## 🐛 Troubleshooting 404 Errors

If you're getting 404 errors:

1. **Check Vercel Configuration:**
   - Ensure `vercel.json` is in the root directory
   - Verify rewrites are properly configured

2. **Check Build Output:**
   - Ensure `build` folder is created after `npm run build`
   - Check for any build errors

3. **Check Routes:**
   - Verify React Router is properly set up
   - Test routes locally first

4. **Redeploy:**
   - Force redeploy in Vercel dashboard
   - Or run `npx vercel --prod` from CLI
