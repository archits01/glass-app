#!/bin/bash

echo "🚀 Deploying Glass Backend to Railway..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "🔐 Logging into Railway..."
railway login

echo "📁 Creating new Railway project..."
railway init

echo "🔧 Setting up environment variables..."
railway variables set JWT_SECRET_KEY="$(openssl rand -base64 32)"
railway variables set NODE_ENV="production"
railway variables set PORT="8000"

echo "🚀 Deploying to Railway..."
railway up

echo "✅ Backend deployment complete!"
echo "🌐 Your backend URL will be shown above"
echo ""
echo "📝 Next steps:"
echo "1. Copy the backend URL"
echo "2. Deploy the frontend to Vercel"
echo "3. Update frontend environment variables" 