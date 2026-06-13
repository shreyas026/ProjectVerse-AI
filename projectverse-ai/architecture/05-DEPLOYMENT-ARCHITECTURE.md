# ProjectVerse AI - Deployment Architecture

## Deployment Strategy

### Environments
| Environment | Purpose | URL |
|------------|---------|-----|
| Local | Development | http://localhost:3000 (web), :5000 (api) |
| Staging | Testing | https://staging.projectverse.ai |
| Production | Live | https://projectverse.ai |

## Docker Setup

### Frontend Dockerfile
```dockerfile
# File: frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
# File: backend/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### ML Service Dockerfile
```dockerfile
# File: backend/ml-service/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5001
CMD ["python", "app.py"]
```

### Docker Compose
```yaml
# File: docker-compose.yml
version: '3.8'

services:
  web:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - api
    restart: unless-stopped

  api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=${REDIS_URL}
      - CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
      - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
      - CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
      - ML_SERVICE_URL=http://ml-service:5001
    depends_on:
      - redis
    restart: unless-stopped

  ml-service:
    build: ./backend/ml-service
    ports:
      - "5001:5001"
    environment:
      - HUGGINGFACE_API_TOKEN=${HUGGINGFACE_API_TOKEN}
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
```

## Cloud Deployment

### Vercel (Frontend Web)
```bash
# File: vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Render (Backend API)
```yaml
# File: render.yaml
services:
  - type: web
    name: projectverse-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: GEMINI_API_KEY
        sync: false
```

### AWS (Full Production Setup)

```
+-------------------------------------------+
|              AWS SETUP                     |
+-------------------------------------------+
|                                            |
|  Route 53 (DNS)                            |
|       |                                    |
|  CloudFront (CDN)                          |
|       |                                    |
|  S3 (Static Assets)                        |
|       |                                    |
|  ALB (Application Load Balancer)           |
|       |                                    |
|  +----+----+----+                          |
|  |    |    |    |                          |
|  EC2 EC2 EC2 EC2  (API Servers - ASG)      |
|  +----+----+----+                          |
|       |                                    |
|  ElastiCache (Redis)                       |
|       |                                    |
|  MongoDB Atlas                             |
|       |                                    |
|  Cloudinary (Media)                        |
+-------------------------------------------+
```

## CI/CD Pipeline (GitHub Actions)

### Frontend CI/CD
```yaml
# File: .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [main]
    paths: ['frontend/**']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run lint
      - run: cd frontend && npm run build
      - run: cd frontend && npm run test
      
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

### Backend CI/CD
```yaml
# File: .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd backend && npm ci
      - run: cd backend && npm run lint
      - run: cd backend && npm run test:coverage
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - run: |
          docker build -t projectverse/api:${{ github.sha }} ./backend
          docker push projectverse/api:${{ github.sha }}
      - uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.AWS_HOST }}
          username: ubuntu
          key: ${{ secrets.SSH_KEY }}
          script: |
            docker pull projectverse/api:${{ github.sha }}
            docker-compose up -d api
```

## Environment Variables Template

```env
# ==========================================
# ProjectVerse AI - Environment Configuration
# ==========================================

# Application
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/projectverse?retryWrites=true&w=majority
MONGODB_DB_NAME=projectverse

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
JWT_RESET_PASSWORD_EXPIRATION=1h
JWT_VERIFY_EMAIL_EXPIRATION=24h

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Google AI (Gemini)
GEMINI_API_KEY=your-gemini-api-key

# Hugging Face
HUGGINGFACE_API_TOKEN=your-hf-token
USE_LOCAL_MODELS=true

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (SendGrid/AWS SES)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=noreply@projectverse.ai
FROM_NAME=ProjectVerse AI

# WebSocket
WS_CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
LOG_FILE=logs/app.log

# ML Service
ML_SERVICE_URL=http://localhost:5001
ML_SERVICE_API_KEY=your-ml-service-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Monitoring & Logging

### PM2 Configuration
```javascript
// File: backend/ecosystem.config.js
module.exports = {
  apps: [{
    name: 'projectverse-api',
    script: './dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G'
  }]
};
```

### Health Check Endpoint
```
GET /health
Response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "uptime": 3600,
  "database": "connected",
  "redis": "connected",
  "ai_service": "connected"
}
```
