# 🚀 Deployment Checklist - PetConnect

## ✅ Pre-Deployment Status

### Backend (Render) - Status: **READY** ✅
- ✅ Dockerfile configured correctly
- ✅ Maven wrapper has execute permissions
- ✅ Port configuration uses `${PORT:8082}` (Render compatible)
- ✅ Environment variables configured for sensitive data
- ✅ CORS configured with environment variable support
- ✅ DevTools disabled in production
- ✅ Logging levels configurable via environment variables

### Frontend (Vercel) - Status: **READY** ✅
- ✅ `vercel.json` configured
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ API endpoints use environment variables (`VITE_API_URL`)
- ✅ All API configs updated to use env vars

---

## 📋 Deployment Steps

### **1. Backend Deployment on Render**

#### Step 1: Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository: `vickykarthik17/PetConnect`
4. Configure:
   - **Name**: `petconnect-backend` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `backend/Dockerfile` (or just `Dockerfile` if root is `backend`)
   - **Plan**: Free or Paid (as needed)

#### Step 2: Set Environment Variables in Render
Go to your Render service → **Environment** tab and add:

```
PORT=8082
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DATABASE=petmanagement
JWT_SECRET=your_secure_jwt_secret_minimum_64_characters
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://your-custom-domain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_admin_password
SPRING_DEVTOOLS_RESTART_ENABLED=false
SPRING_DEVTOOLS_LIVERELOAD_ENABLED=false
LOG_LEVEL_SECURITY=INFO
LOG_LEVEL_WEB=INFO
LOG_LEVEL_APP=INFO
LOG_LEVEL_HIBERNATE_SQL=WARN
LOG_LEVEL_HIBERNATE_BINDER=WARN
JPA_SHOW_SQL=false
```

**Important Notes:**
- Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas URI
- Generate a secure JWT secret (minimum 64 characters)
- Update `CORS_ALLOWED_ORIGINS` with your actual Vercel frontend URL(s)
- After deployment, copy your Render service URL (e.g., `https://petconnect-backend.onrender.com`)

#### Step 3: Deploy
- Click "Create Web Service"
- Render will automatically build and deploy
- Monitor the logs for any issues
- Wait for deployment to complete (usually 5-10 minutes)

---

### **2. Frontend Deployment on Vercel**

#### Step 1: Update vercel.json
Before deploying, update the backend URL in `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR-RENDER-BACKEND-URL.onrender.com/api/$1"
    }
  ]
}
```

#### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `vickykarthik17/PetConnect`
4. Vercel will auto-detect Vite configuration
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

#### Step 3: Set Environment Variables in Vercel
Go to your Vercel project → **Settings** → **Environment Variables** and add:

```
VITE_API_URL=https://YOUR-RENDER-BACKEND-URL.onrender.com/api
```

**Important:**
- Replace `YOUR-RENDER-BACKEND-URL` with your actual Render backend URL
- Make sure to add this for **Production**, **Preview**, and **Development** environments

#### Step 4: Deploy
- Click "Deploy"
- Wait for build to complete
- Copy your Vercel deployment URL

#### Step 5: Update Backend CORS
After getting your Vercel URL, go back to Render and update the `CORS_ALLOWED_ORIGINS` environment variable:
```
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

Then restart your Render service.

---

## 🔍 Post-Deployment Verification

### Backend Health Check
1. Visit: `https://YOUR-RENDER-BACKEND-URL.onrender.com/api/health` (if you have a health endpoint)
2. Check Render logs for any errors
3. Verify MongoDB connection in logs

### Frontend Check
1. Visit your Vercel deployment URL
2. Open browser DevTools → Network tab
3. Try logging in or making an API call
4. Verify API calls are going to your Render backend
5. Check for CORS errors in console

### Common Issues & Solutions

#### Issue: CORS Errors
**Solution**: 
- Verify `CORS_ALLOWED_ORIGINS` in Render includes your Vercel URL
- Check that the URL matches exactly (including `https://`)
- Restart Render service after updating CORS

#### Issue: 404 on API Calls
**Solution**:
- Verify `VITE_API_URL` in Vercel matches your Render backend URL
- Check that the URL ends with `/api`
- Verify `vercel.json` rewrites are configured correctly

#### Issue: Backend Not Starting
**Solution**:
- Check Render logs for errors
- Verify all environment variables are set correctly
- Ensure MongoDB URI is correct and accessible
- Check that PORT environment variable is set

#### Issue: Build Failures
**Solution**:
- Check build logs in Render/Vercel
- Verify all dependencies are in `package.json` or `pom.xml`
- Ensure Dockerfile is correct (we've already fixed this)

---

## 📝 Environment Variables Summary

### Render (Backend)
| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | ✅ | Port number (Render sets this automatically) |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `MONGODB_DATABASE` | ✅ | MongoDB database name (default: petmanagement) |
| `JWT_SECRET` | ✅ | Secure JWT secret (min 64 chars) |
| `CORS_ALLOWED_ORIGINS` | ✅ | Comma-separated list of allowed origins |
| `ADMIN_USERNAME` | ⚠️ | Admin username (optional, defaults to 'admin') |
| `ADMIN_PASSWORD` | ⚠️ | Admin password (optional, defaults to 'admin') |

### Vercel (Frontend)
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Your Render backend URL + `/api` |

---

## ✅ Final Checklist

Before going live:
- [ ] Backend deployed on Render
- [ ] Backend environment variables set
- [ ] Backend health check passes
- [ ] Frontend deployed on Vercel
- [ ] Frontend environment variables set
- [ ] `vercel.json` updated with correct backend URL
- [ ] CORS configured with Vercel URL
- [ ] Test login/registration
- [ ] Test API calls from frontend
- [ ] No console errors
- [ ] No CORS errors
- [ ] MongoDB connection working

---

## 🎉 You're Ready!

Once all items are checked, your application should be live and working!

**Need Help?**
- Check Render logs: Render Dashboard → Your Service → Logs
- Check Vercel logs: Vercel Dashboard → Your Project → Deployments → View Function Logs
- Check browser console for frontend errors
- Verify environment variables are set correctly

