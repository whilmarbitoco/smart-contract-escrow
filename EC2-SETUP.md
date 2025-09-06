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
   Replace the IP in the shared network config:
   ```typescript
   shared: {
     url: "http://18.139.160.100:8545", // Update with your EC2 IP
     accounts: [
       "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
       "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
       "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
       "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
       "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a"
     ],
   }
   ```

## Development Workflow

### 1. Basic Deployment
```bash
# Deploy standard escrow contract
npm run deploy:shared

# Deploy with dummy wallets
npm run deploy:dummy

# Deploy centralized version
npm run deploy:centralized
```

### 2. Testing & Interaction
```bash
# Run tests on shared network
npm run test:shared

# Check available accounts
npm run accounts

# Interact with deployed contract
CONTRACT_ADDRESS=0x... npm run interact

# Simulate full delivery flow
CONTRACT_ADDRESS=0x... npm run simulate
```

### 3. Wallet Management
```bash
# Generate new dummy wallets
npm run create-wallets
```

## Available Scripts

### Network Management
- `npm run node` - Start local Hardhat network
- `npm run node:shared` - Start shared network (EC2 only)

### Deployment
- `npm run deploy:local` - Deploy to localhost
- `npm run deploy:shared` - Deploy to shared network
- `npm run deploy:dummy` - Deploy with dummy wallet addresses
- `npm run deploy:centralized` - Deploy centralized version

### Testing & Utilities
- `npm run test:local` - Run tests locally
- `npm run test:shared` - Run tests on shared network
- `npm run compile` - Compile contracts
- `npm run accounts` - Show available test accounts
- `npm run create-wallets` - Generate dummy wallets

### Interaction
- `npm run interact` - Interact with deployed contract
- `npm run simulate` - Simulate full delivery flow

## Contract Addresses & Wallets

### Pre-configured Test Accounts
The shared network uses Hardhat's default accounts:

```
Account 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account 1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Account 2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Account 3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906
Account 4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65
```

### Dummy Wallet Usage
For production-like testing with specific wallet addresses:
1. Run `npm run create-wallets` to generate new wallets
2. Use `npm run deploy:dummy` to deploy with dummy addresses
3. Update your frontend with the generated private keys

## Frontend Integration

### Environment Variables
```env
# .env.local (for Next.js)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_RPC_URL=http://18.139.160.100:8545
PRODUCER_PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
SUPERMARKET_PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

### Contract Integration
See `api-docs.md` for complete Next.js integration guide.

## Security Notes

- **Port Access**: Only expose port 8545 to trusted team IPs
- **Private Keys**: Use dummy keys for development only
- **Network Security**: Use EC2 security groups to restrict access
- **Development Only**: This setup is not for production use
- **Status Tracking**: Contract only tracks delivery status - no actual ETH transfers

## Troubleshooting

### Common Issues
1. **Connection Failed**: Check EC2 IP and security group settings
2. **Transaction Failed**: Ensure correct wallet is being used for the action
3. **Contract Not Found**: Verify contract address after deployment
4. **Permission Denied**: Check if correct role (producer/supermarket) is calling function

### Debug Commands
```bash
# Check network connectivity
curl http://18.139.160.100:8545

# Verify contract deployment
npm run accounts

# Test contract interaction
CONTRACT_ADDRESS=0x... npm run interact
```