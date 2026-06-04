# PetConnect - Complete Setup & Troubleshooting Guide

## Quick Start (Local Development)

### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run
```
Backend will start at: `http://localhost:8082`

### 2. Start the Frontend (in another terminal)
```bash
npm install  # if not done yet
npm run dev:frontend
```
Frontend will start at: `http://localhost:5173`

### 3. OR Run Both Together
```bash
npm run dev
```
This runs frontend + backend concurrently using the npm `concurrently` package.

---

## Fixing Backend Connection Errors

You may see these errors in the console:
```
Failed to load resource: the server responded with a status of 404 vite.svg ❌
Backend connection check failed: Object ❌
Backend health check failed. Retrying in 1 seconds... ⚠️
Maximum retry attempts reached. Backend might be down. ❌
```

### Solution

**These errors appear because:**
1. ✅ vite.svg - **FIXED** - Added public/vite.svg
2. ❌ Backend not running - **YOU NEED TO START IT**

### Step-by-Step Fix

#### Step 1: Open a NEW terminal window
```bash
cd c:\Users\vkart\Documents\PetConnect-main
cd backend
```

#### Step 2: Start the backend
```bash
mvn spring-boot:run
```

**Wait for this message:**
```
Started PetManagementApplication in X.XXX seconds
```

#### Step 3: Check backend is running
Open another terminal and test:
```bash
curl http://localhost:8082/api/health
```

Should return: `OK` or similar

#### Step 4: Your frontend should now work
- The console errors should stop
- You can now test login/signup
- Use the app normally

---

## Application Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (Vite + React)         │
│    Runs on: http://localhost:5173       │
│    Port: 5173                           │
└────────────────┬────────────────────────┘
                 │
         HTTP/API Requests
                 │
┌────────────────▼────────────────────────┐
│     Backend (Spring Boot)               │
│    Runs on: http://localhost:8082       │
│    Port: 8082                           │
└────────────────┬────────────────────────┘
                 │
         Database Connection
                 │
┌────────────────▼────────────────────────┐
│    H2 Database (In-Memory)              │
│    Default: No external DB needed       │
└─────────────────────────────────────────┘
```

---

## Port Reference

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Frontend | 5173 | http://localhost:5173 | Check browser |
| Backend API | 8082 | http://localhost:8082/api | Check health endpoint |
| Database (H2) | N/A | Embedded in backend | Internal only |

---

## How to Know Everything is Working

✅ **All of these should be true:**

1. **Frontend loads without errors:**
   - Browser shows login page
   - No 404 errors for assets

2. **Backend is running:**
   ```bash
   curl http://localhost:8082/api/health
   # Should return: OK
   ```

3. **Console has no red errors:**
   - May have warning about browserslist (harmless)
   - NO "Backend connection check failed" errors

4. **Can see login page:**
   - PetConnect logo visible
   - Email/password fields present
   - "Signing in..." button visible

5. **Can interact with the app:**
   - Click buttons without 404 errors
   - Can navigate between pages
   - (Signup/login will fail if backend isn't running, but no JS errors)

---

## Common Issues & Solutions

### Issue 1: Backend won't start
```
Error: Port 8082 already in use
```

**Solution:**
```bash
# Windows - Find process on port 8082
netstat -ano | findstr :8082

# Kill the process
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8082
kill -9 <PID>
```

### Issue 2: Frontend shows blank page
**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
npm run dev:frontend
```

### Issue 3: "Cannot find module" errors
**Solution:**
```bash
npm install
npm audit fix
npm run build  # Test build
```

### Issue 4: CORS errors
**Solution:**
- Backend CORS is already configured
- Make sure backend is running on port 8082
- Check browser console for exact error

### Issue 5: Login page loads but buttons don't work
**Likely cause:** Backend isn't running

**Solution:** Start backend:
```bash
cd backend
mvn spring-boot:run
```

---

## Testing the Application

### Test Login (No Real Database)
- Email: `test@example.com`
- Password: `Test123!`

(These are test credentials - replace with backend's validation)

### Test API Endpoint
```bash
# Get all pets
curl http://localhost:8082/api/pets

# Health check
curl http://localhost:8082/api/health

# With authentication (after login)
curl -H "Authorization: Bearer <TOKEN>" http://localhost:8082/api/pets
```

---

## Database Setup (Optional)

### Current Setup: H2 (In-Memory)
- No configuration needed
- Data resets when backend restarts
- Perfect for development

### To Use PostgreSQL (Optional)
1. Install PostgreSQL
2. Create database:
   ```sql
   CREATE DATABASE petconnect;
   ```
3. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/petconnect
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   ```
4. Restart backend

---

## Build for Production

### Frontend Build
```bash
npm run build
# Output: dist/ folder ready for deployment
```

### Backend Build
```bash
cd backend
mvn clean package
# Output: backend/target/pet-management-0.0.1-SNAPSHOT.jar
```

### Docker Build
```bash
# Backend
docker build -t petconnect-backend:latest ./backend

# Frontend
docker build -f Dockerfile.frontend -t petconnect-frontend:latest .
```

---

## Deployment

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for:
- Docker deployment instructions
- Docker Compose setup
- Deployment to Render/Heroku/Railway/Vercel
- Environment configuration

---

## Need Help?

Check these files:
- **[QUICK_START.md](QUICK_START.md)** - Basic setup
- **[AUDIT_REPORT.md](AUDIT_REPORT.md)** - What was fixed
- **[DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)** - Deployment guide

---

*Last Updated: June 4, 2026*
*Status: ✅ All systems operational (when backend is running)*
