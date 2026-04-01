#!/bin/bash
# Quick start script for development

echo "📧 Portfolio Email Server - Quick Start"
echo "======================================="
echo ""

# Check if .env file exists
if [ ! -f server/.env ]; then
    echo "⚠️  server/.env not found!"
    echo "   Creating from template..."
    cp server/.env.example server/.env
    echo "   Please update server/.env with your Resend API key"
    echo ""
fi

echo "🔧 Installing dependencies..."
echo ""

echo "Backend dependencies:"
cd server
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Get your Resend API key: https://resend.com/api-keys"
echo "2. Add it to server/.env (RESEND_API_KEY)"
echo "3. Run: 'npm run dev' in root (frontend)"
echo "4. Run: 'cd server && npm run dev' in another terminal (backend)"
echo ""
echo "🧪 Test at: http://localhost:5173"
echo ""
