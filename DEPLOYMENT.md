# 🚀 Glass Cloud Deployment Guide

## Quick Deploy Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `pickleglass_web`
   - Add environment variable: `NEXT_PUBLIC_API_URL` = your backend URL

#### Backend (Railway)
1. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Import your GitHub repository
   - Set root directory to `pickleglass_web/backend_node`
   - Add environment variables:
     - `JWT_SECRET_KEY` = your secret key
     - `pickleglass_WEB_URL` = your frontend URL

### Option 2: Render (All-in-one)

#### Frontend
1. **Create Web Service**:
   - Connect GitHub repository
   - Root directory: `pickleglass_web`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Environment: `NEXT_PUBLIC_API_URL` = your backend URL

#### Backend
1. **Create Web Service**:
   - Connect GitHub repository
   - Root directory: `pickleglass_web/backend_node`
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment variables:
     - `JWT_SECRET_KEY` = your secret key
     - `pickleglass_WEB_URL` = your frontend URL

### Option 3: DigitalOcean App Platform

1. **Create App**:
   - Connect GitHub repository
   - Add both frontend and backend as separate components
   - Configure environment variables for each

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend
```bash
JWT_SECRET_KEY=your-secret-key-here
pickleglass_WEB_URL=https://your-frontend-url.com
NODE_ENV=production
PORT=8000
```

## Database Considerations

### For Production
- **SQLite**: Good for small to medium apps
- **PostgreSQL**: Recommended for production (Railway/Render provide this)
- **MongoDB**: Alternative option

### Database Migration
If switching from SQLite to PostgreSQL:
1. Update `db.js` to use PostgreSQL
2. Migrate existing data
3. Update connection strings

## SSL/HTTPS
- Vercel, Railway, and Render provide automatic HTTPS
- Update CORS settings to use HTTPS URLs
- Update frontend API calls to use HTTPS

## Monitoring
- Set up health checks at `/` endpoint
- Monitor logs in your cloud provider dashboard
- Set up alerts for downtime

## Cost Estimation
- **Vercel**: Free tier available, $20/month for pro
- **Railway**: $5/month for basic plan
- **Render**: Free tier available, $7/month for standard
- **DigitalOcean**: $5/month for basic app

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure `pickleglass_WEB_URL` is set correctly
2. **Database connection**: Check database credentials and connection strings
3. **Build failures**: Ensure all dependencies are in package.json
4. **Environment variables**: Verify all required env vars are set

### Debug Commands
```bash
# Check if backend is running
curl https://your-backend-url.com/

# Check frontend build
npm run build

# Test API endpoints
curl https://your-backend-url.com/api/sync/status
```

## Next Steps
1. Choose your preferred platform
2. Set up environment variables
3. Deploy backend first, then frontend
4. Test all functionality
5. Set up custom domain (optional)
6. Configure monitoring and alerts 