#!/bin/bash

echo "🚀 Setting up Thinking Styles Assessment with PostgreSQL..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker is available"

# Start PostgreSQL with Docker
echo "🐘 Starting PostgreSQL database..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d postgres
else
    docker compose up -d postgres
fi

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is running
if docker ps | grep -q postgres; then
    echo "✅ PostgreSQL is running"
else
    echo "❌ Failed to start PostgreSQL"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Build the backend
echo "🔨 Building backend..."
npm run build

# Start the backend server
echo "🚀 Starting backend server..."
npm start &

# Wait a moment for the server to start
sleep 5

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Start the frontend
echo "🌐 Starting frontend..."
npm start &

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 What's running:"
echo "   • PostgreSQL database on port 5432"
echo "   • Backend API on port 5001"
echo "   • Frontend on port 3000"
echo ""
echo "🔗 Access your application at: http://localhost:3000"
echo ""
echo "📝 Database credentials:"
echo "   • Host: localhost"
echo "   • Port: 5432"
echo "   • Database: thinking_styles"
echo "   • Username: postgres"
echo "   • Password: password"
echo ""
echo "🛑 To stop everything, run: docker-compose down"
