FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Compile contracts
RUN npm run compile

# Expose port 8545 for Hardhat network
EXPOSE 8545

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Starting Hardhat network..."' >> /app/start.sh && \
    echo 'npm run node:shared &' >> /app/start.sh && \
    echo 'HARDHAT_PID=$!' >> /app/start.sh && \
    echo 'echo "Waiting for network to start..."' >> /app/start.sh && \
    echo 'sleep 10' >> /app/start.sh && \
    echo 'echo "Deploying contracts..."' >> /app/start.sh && \
    echo 'npm run deploy:shared' >> /app/start.sh && \
    echo 'echo "Deployment complete. Network running on port 8545"' >> /app/start.sh && \
    echo 'wait $HARDHAT_PID' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start the network and deploy
CMD ["/app/start.sh"]