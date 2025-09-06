# Delivery Status Tracking Smart Contract

A blockchain-based delivery status tracking system for producer-supermarket transactions. This contract tracks delivery status only - actual payments are handled off-chain.

## Contract Overview

The `DeliveryEscrow` contract manages delivery status with four states:
- **Pending** - Order created, awaiting shipment
- **InTransit** - Producer has marked goods as shipped  
- **Completed** - Supermarket confirmed delivery
- **Failed** - Delivery failed or cancelled

## Key Features

- **Status Tracking Only** - No cryptocurrency transfers
- **Role-Based Access** - Producer and supermarket have specific permissions
- **Event Logging** - All status changes are logged on-chain
- **Immutable Records** - Transparent delivery history

## Development Setup

### Local Development
```bash
npm install
npm run node          # Start local Hardhat network
npm run deploy:local   # Deploy to local network
npm run test:local     # Run tests locally
```

### Shared Team Development (EC2)
```bash
npm run node:shared    # Start shared network (EC2 only)
npm run deploy:shared  # Deploy to shared network
npm run test:shared    # Run tests on shared network
```

See `EC2-SETUP.md` for complete team setup instructions.

## Usage Example

```typescript
// Deploy contract
const escrow = await DeliveryEscrow.deploy(
  producerAddress,
  supermarketAddress,
  1000, // Order value reference
  "TRACK123"
);

// Producer marks as shipped
await escrow.connect(producer).markShipped();

// Supermarket confirms delivery
await escrow.connect(supermarket).confirmDelivery();
```

## Available Scripts

- `npm run accounts` - Show available test accounts
- `npm run compile` - Compile contracts
- `npm run interact` - Interact with deployed contract

## Architecture

This is a **status tracking system** where:
- Smart contract records delivery milestones
- Actual payments processed through traditional systems
- Blockchain provides immutable audit trail
- No gas fees in development environment