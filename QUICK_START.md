# PetConnect Quick Start Guide

## Prerequisites
- Node.js v16+ (for frontend)
- Java 17+ (for backend)
- Maven 3.6+ (for backend build)

## Installation & Running

### Option 1: Run Both Frontend and Backend Concurrently
```bash
npm install          # Install frontend dependencies
cd backend && mvn clean install  # Install backend & build JAR
npm run dev          # Runs both frontend and backend together
```
Frontend will be available at: `http://localhost:5173`
Backend API will be available at: `http://localhost:8082`

### Option 2: Run Frontend Only (Dev Mode)
```bash
npm install
npm run dev:frontend
```
Frontend will be available at: `http://localhost:5173`

### Option 3: Run Backend Only
```bash
cd backend
mvn spring-boot:run
```
Backend API will be available at: `http://localhost:8082`

### Option 4: Build for Production
```bash
npm run build        # Builds optimized production bundle
cd backend
mvn clean package    # Creates JAR file
```
- Frontend: Optimized files in `dist/` directory
- Backend: JAR file at `backend/target/pet-management-0.0.1-SNAPSHOT.jar`

## Environment Variables

Create a `.env.local` file in the root directory:
```
VITE_API_URL=http://localhost:8082/api
```

## Troubleshooting

### Frontend won't start
```bash
npm install              # Reinstall dependencies
npm run build            # Check for build errors
npm run lint            # Check code quality
```

### Backend won't compile
```bash
cd backend
mvn clean compile       # Clean and recompile
mvn dependency:tree     # Check dependencies
```

### API connection errors
- Ensure backend is running on port 8082
- Check `.env.local` has correct API URL
- Verify CORS is enabled on backend

## Performance Notes

✅ **Optimizations Applied:**
- Code splitting with separate vendor chunks
- Lazy loading on all pages
- Minification enabled
- Console logs removed in production
- API timeout increased to 60s

📊 **Expected Load Time:** 1-2 seconds (after initial load)

## Testing

Run linter:
```bash
npm run lint
```

Build production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## API Endpoints

Base URL: `http://localhost:8082/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh-token` - Refresh token

### Pets
- `GET /pets` - Get all available pets
- `GET /pets/:id` - Get pet details
- `POST /pets/register` - Register a new pet (requires auth)

### Contact
- `POST /contact` - Submit contact form

### Users
- `GET /users/profile` - Get user profile (requires auth)
- `PUT /users/profile` - Update user profile (requires auth)

## Key Features

✅ Pet adoption platform
✅ User authentication with JWT
✅ Pet registration and management
✅ Contact form
✅ Success stories showcase
✅ Volunteer signup
✅ Responsive design (mobile & desktop)
✅ Error boundaries & error handling
✅ Loading states for better UX

---

*Last Updated: June 4, 2026*
