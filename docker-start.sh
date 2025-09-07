#!/bin/bash

echo "🚀 Starting Hardhat Network with Docker..."

# Create logs directory
mkdir -p logs

# Build and start the container
echo "📦 Building Docker image..."
npm run docker:build

echo "🔄 Starting container..."
npm run docker:up

echo "⏳ Waiting for network to be ready..."
sleep 15

echo "📊 Checking container status..."
npm run docker:status

echo "📋 Showing logs..."
npm run docker:logs

echo ""
echo "✅ Hardhat network is running!"
echo "🌐 Network URL: http://$(curl -s ifconfig.me):8545"
echo "🔍 Check logs: npm run docker:logs"
echo "🛑 Stop network: npm run docker:down"