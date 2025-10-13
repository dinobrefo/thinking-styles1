#!/bin/bash

# Build script for Vercel deployment
echo "Building ThinkAlign frontend..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the project
echo "Building project..."
npm run build

# Copy build files to root for Vercel
echo "Copying build files to root..."
cp -r build/* ../

echo "Build complete!"
