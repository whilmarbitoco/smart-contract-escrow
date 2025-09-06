# EC2 Setup Guide for Shared Hardhat Network

## EC2 Instance Setup

1. **Launch EC2 Instance**
   - Instance type: `t3.micro` (sufficient for development)
   - AMI: Ubuntu 22.04 LTS
   - Storage: 8GB (default)

2. **Security Group Configuration**
   ```
   Type: Custom TCP
   Port: 8545
   Source: Your team's IP addresses (or 0.0.0.0/0 for testing)
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install Git
   sudo apt install git -y
   
   # Clone your project
   git clone <your-repo-url>
   cd escrow-project
   
   # Install dependencies
   npm install
   ```

4. **Start Shared Network**
   ```bash
   npm run node:shared
   ```

## Team Configuration

1. **Update hardhat.config.ts**
   Replace `YOUR_EC2_IP` with actual EC2 public IP:
   ```typescript
   shared: {
     url: "http://YOUR_ACTUAL_EC2_IP:8545",
     // ... rest of config
   }
   ```

2. **Team Workflow**
   ```bash
   # Deploy to shared network
   npm run deploy:shared
   
   # Run tests on shared network
   npm run test:shared
   
   # Check available accounts
   npm run accounts
   
   # Interact with deployed contract
   CONTRACT_ADDRESS=0x... npm run interact
   ```

## Available Scripts

- `npm run node:shared` - Start shared Hardhat network (EC2 only)
- `npm run deploy:shared` - Deploy to shared network
- `npm run test:shared` - Run tests on shared network
- `npm run accounts` - Show available test accounts
- `npm run interact` - Interact with deployed contract

## Test Accounts

The shared network provides 20 test accounts for signing transactions.
First 5 accounts are configured in hardhat.config.ts for easy access.

**Note**: This contract only tracks delivery status - no actual ETH transfers occur.

## Security Notes

- Only expose port 8545 to trusted team IPs
- Use EC2 security groups to restrict access
- This setup is for development only, not production