# PetConnect Docker Deployment Guide

## Docker Build & Run

### Build Docker Image
```bash
# Build the backend Docker image
docker build -t petconnect-backend:latest ./backend

# Or with custom tag for deployment
docker build -t petconnect-backend:v1.0 ./backend
```

### Run Docker Container
```bash
# Run the backend container
docker run -d \
  --name petconnect-backend \
  -p 8082:8082 \
  --env SPRING_DATASOURCE_URL=jdbc:h2:mem:testdb \
  petconnect-backend:latest

# Check logs
docker logs -f petconnect-backend

# Stop container
docker stop petconnect-backend

# Remove container
docker rm petconnect-backend
```

### Docker Compose (Optional)
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: ./backend/Dockerfile
    container_name: petconnect-backend
    ports:
      - "8082:8082"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:h2:mem:testdb
      - JAVA_OPTS=-Xmx256m -Xms128m
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8082/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: petconnect-frontend
    ports:
      - "80:3000"
    environment:
      - VITE_API_URL=http://backend:8082/api
    depends_on:
      - backend
```

Run with Docker Compose:
```bash
docker-compose up -d
```

## Deployment to Render or Similar Platforms

### Backend Deployment (Spring Boot JAR)
1. Push code to GitHub (already done ✅)
2. On Render/Heroku/Railway:
   - Connect GitHub repository
   - Set build command: `cd backend && mvn clean package -DskipTests`
   - Set start command: `java -jar backend/target/pet-management-0.0.1-SNAPSHOT.jar`
   - Add environment variables if needed

### Frontend Deployment (Vite)
1. Push code to GitHub (already done ✅)
2. On Vercel/Netlify/Render:
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment: `VITE_API_URL=https://your-backend-url.com/api`

## Environment Variables

Create `.env.local` file (not committed):
```
VITE_API_URL=http://localhost:8082/api
```

For production:
```
VITE_API_URL=https://petconnect-api.onrender.com/api
```

## Troubleshooting Docker Build

### Issue: "mvnw" or ".mvn" not found
**Solution:** Already fixed in updated Dockerfile. Uses system Maven instead of wrapper.

### Issue: Port already in use
```bash
# Find process using port 8082
netstat -ano | findstr :8082

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Issue: Container exits immediately
```bash
# Check logs
docker logs <container_id>

# Run with interactive terminal for debugging
docker run -it petconnect-backend:latest /bin/bash
```

## Health Checks

### Backend Health Endpoint
```bash
curl http://localhost:8082/api/health
```

### Frontend Running Check
```bash
curl http://localhost:3000
```

## Performance Notes

- **Build time:** ~5-7 minutes (first build)
- **Cached build:** ~30 seconds
- **Runtime memory:** ~256MB-512MB (configurable)
- **Startup time:** ~15-30 seconds

## Production Checklist

- [ ] Database configured (H2, PostgreSQL, MySQL)
- [ ] Environment variables set
- [ ] SSL/HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Backups configured
- [ ] Monitoring set up

---

*Last Updated: June 4, 2026*
