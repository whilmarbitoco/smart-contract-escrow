# ⛓️ Smart Contract Escrow

[![Solidity](https://img.shields.io/badge/Solidity-0.8+-363636?logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-FFCF18?logo=ethereum&logoColor=black)](https://hardhat.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A blockchain-based delivery status tracking system for producer-supermarket transactions. The smart contract records delivery milestones on-chain while payments are handled off-chain — providing an immutable audit trail without cryptocurrency transfers.

## ✨ Highlights

- **Status Tracking Only** — No cryptocurrency transfers, pure delivery milestone recording
- **Role-Based Access** — Producer and supermarket have specific on-chain permissions
- **Event Logging** — All status changes emit on-chain events for transparent history
- **Immutable Records** — Tamper-proof delivery history on the blockchain
- **Full Test Suite** — Comprehensive Hardhat tests with local and shared network support

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Smart Contract | Solidity 0.8+ |
| Framework | Hardhat |
| Language | TypeScript |
| Network | Local Hardhat / EC2 shared |

## 🚀 Quick Start

```bash
git clone https://github.com/whilmarbitoco/smart-contract-escrow.git
cd smart-contract-escrow
npm install
npm run node          # Start local Hardhat network
npm run deploy:local  # Deploy to local network
npm run test:local    # Run tests
```

### Contract States

```
Pending → InTransit → Completed
                   ↘ Failed
```

### Usage

```typescript
const escrow = await DeliveryEscrow.deploy(
  producerAddress,
  supermarketAddress,
  1000,
  "TRACK123"
);

await escrow.connect(producer).markShipped();
await escrow.connect(supermarket).confirmDelivery();
```

## 📄 License

MIT © [Whilmar Bitoco](https://github.com/whilmarbitoco)
