# DeliveryEscrow API Documentation for Next.js Frontend

## Overview
This document provides complete API integration guide for accessing the DeliveryEscrow smart contract from a Next.js frontend using ethers.js.

## Setup

### 1. Install Dependencies
```bash
npm install ethers
```

### 2. Environment Variables
```env
# .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_RPC_URL=http://YOUR_EC2_IP:8545
PRODUCER_PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
SUPERMARKET_PRIVATE_KEY=0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

### 3. Contract ABI
```typescript
// lib/contract-abi.ts
export const DELIVERY_ESCROW_ABI = [
  "constructor(address _producer, address _supermarket, uint256 _amount, string _trackingId)",
  "function producer() view returns (address)",
  "function supermarket() view returns (address)",
  "function amount() view returns (uint256)",
  "function trackingId() view returns (string)",
  "function status() view returns (uint8)",
  "function markShipped()",
  "function confirmDelivery()",
  "function markFailed()",
  "event StatusUpdated(uint8 newStatus, string trackingId)",
  "event EscrowCreated(address producer, address supermarket, uint256 amount, string trackingId)"
];
```

## API Endpoints

### 1. Contract Connection Service

```typescript
// lib/contract.ts
import { ethers } from 'ethers';
import { DELIVERY_ESCROW_ABI } from './contract-abi';

export class EscrowService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    this.contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
      DELIVERY_ESCROW_ABI,
      this.provider
    );
  }

  // Get contract with signer
  private getContractWithSigner(privateKey: string) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    return this.contract.connect(wallet);
  }

  // Read contract state
  async getOrderDetails() {
    return {
      producer: await this.contract.producer(),
      supermarket: await this.contract.supermarket(),
      amount: await this.contract.amount(),
      trackingId: await this.contract.trackingId(),
      status: await this.contract.status()
    };
  }

  // Producer actions
  async markShipped() {
    const contract = this.getContractWithSigner(process.env.PRODUCER_PRIVATE_KEY!);
    const tx = await contract.markShipped();
    return await tx.wait();
  }

  // Supermarket actions
  async confirmDelivery() {
    const contract = this.getContractWithSigner(process.env.SUPERMARKET_PRIVATE_KEY!);
    const tx = await contract.confirmDelivery();
    return await tx.wait();
  }

  async markFailed() {
    const contract = this.getContractWithSigner(process.env.SUPERMARKET_PRIVATE_KEY!);
    const tx = await contract.markFailed();
    return await tx.wait();
  }

  // Listen to events
  onStatusUpdate(callback: (status: number, trackingId: string) => void) {
    this.contract.on("StatusUpdated", callback);
  }
}
```

### 2. Next.js API Routes

#### GET /api/escrow/status
```typescript
// pages/api/escrow/status.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { EscrowService } from '../../../lib/contract';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const escrowService = new EscrowService();
    const details = await escrowService.getOrderDetails();
    
    const statusNames = ['Pending', 'InTransit', 'Completed', 'Failed'];
    
    res.status(200).json({
      success: true,
      data: {
        ...details,
        statusName: statusNames[Number(details.status)],
        amount: details.amount.toString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch order status' 
    });
  }
}
```

#### POST /api/escrow/mark-shipped
```typescript
// pages/api/escrow/mark-shipped.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { EscrowService } from '../../../lib/contract';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const escrowService = new EscrowService();
    const receipt = await escrowService.markShipped();
    
    res.status(200).json({
      success: true,
      data: {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: 'InTransit'
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to mark as shipped' 
    });
  }
}
```

#### POST /api/escrow/confirm-delivery
```typescript
// pages/api/escrow/confirm-delivery.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { EscrowService } from '../../../lib/contract';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const escrowService = new EscrowService();
    const receipt = await escrowService.confirmDelivery();
    
    res.status(200).json({
      success: true,
      data: {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: 'Completed'
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to confirm delivery' 
    });
  }
}
```

#### POST /api/escrow/mark-failed
```typescript
// pages/api/escrow/mark-failed.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { EscrowService } from '../../../lib/contract';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const escrowService = new EscrowService();
    const receipt = await escrowService.markFailed();
    
    res.status(200).json({
      success: true,
      data: {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: 'Failed'
      }
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to mark as failed' 
    });
  }
}
```

## Frontend Components

### 1. Order Status Component
```typescript
// components/OrderStatus.tsx
import { useState, useEffect } from 'react';

interface OrderDetails {
  producer: string;
  supermarket: string;
  amount: string;
  trackingId: string;
  status: number;
  statusName: string;
}

export default function OrderStatus() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderStatus();
  }, []);

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch('/api/escrow/status');
      const result = await response.json();
      if (result.success) {
        setOrder(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch order status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Order Status</h2>
      <div className="space-y-2">
        <p><strong>Tracking ID:</strong> {order.trackingId}</p>
        <p><strong>Status:</strong> {order.statusName}</p>
        <p><strong>Order Value:</strong> {order.amount}</p>
        <p><strong>Producer:</strong> {order.producer}</p>
        <p><strong>Supermarket:</strong> {order.supermarket}</p>
      </div>
    </div>
  );
}
```

### 2. Producer Actions Component
```typescript
// components/ProducerActions.tsx
import { useState } from 'react';

export default function ProducerActions() {
  const [loading, setLoading] = useState(false);

  const handleMarkShipped = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/escrow/mark-shipped', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        alert('Order marked as shipped!');
        window.location.reload(); // Refresh to show updated status
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Failed to mark as shipped');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Producer Actions</h3>
      <button
        onClick={handleMarkShipped}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Mark as Shipped'}
      </button>
    </div>
  );
}
```

### 3. Supermarket Actions Component
```typescript
// components/SupermarketActions.tsx
import { useState } from 'react';

export default function SupermarketActions() {
  const [loading, setLoading] = useState(false);

  const handleConfirmDelivery = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/escrow/confirm-delivery', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        alert('Delivery confirmed!');
        window.location.reload();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Failed to confirm delivery');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkFailed = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/escrow/mark-failed', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        alert('Order marked as failed!');
        window.location.reload();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Failed to mark as failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">Supermarket Actions</h3>
      <div className="space-x-2">
        <button
          onClick={handleConfirmDelivery}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Confirm Delivery'}
        </button>
        <button
          onClick={handleMarkFailed}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Mark Failed'}
        </button>
      </div>
    </div>
  );
}
```

## Usage Examples

### 1. Main Dashboard Page
```typescript
// pages/dashboard.tsx
import OrderStatus from '../components/OrderStatus';
import ProducerActions from '../components/ProducerActions';
import SupermarketActions from '../components/SupermarketActions';

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Delivery Escrow Dashboard</h1>
      
      <div className="grid gap-6">
        <OrderStatus />
        <div className="grid md:grid-cols-2 gap-4">
          <ProducerActions />
          <SupermarketActions />
        </div>
      </div>
    </div>
  );
}
```

### 2. Real-time Updates with WebSocket
```typescript
// hooks/useEscrowEvents.ts
import { useEffect, useState } from 'react';
import { EscrowService } from '../lib/contract';

export function useEscrowEvents() {
  const [lastUpdate, setLastUpdate] = useState<{status: number, trackingId: string} | null>(null);

  useEffect(() => {
    const escrowService = new EscrowService();
    
    escrowService.onStatusUpdate((status, trackingId) => {
      setLastUpdate({ status: Number(status), trackingId });
    });

    return () => {
      // Cleanup event listeners
    };
  }, []);

  return lastUpdate;
}
```

## Error Handling

### Common Error Responses
```typescript
// Error response format
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE" // Optional
}

// Success response format
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Codes
- `INVALID_STATUS` - Current status doesn't allow this action
- `UNAUTHORIZED` - Wrong wallet trying to perform action
- `NETWORK_ERROR` - Blockchain network connection failed
- `TRANSACTION_FAILED` - Transaction was rejected

## Security Notes

1. **Private Keys**: Store in environment variables, never expose to frontend
2. **API Validation**: Always validate requests before blockchain calls
3. **Rate Limiting**: Implement rate limiting on API endpoints
4. **Error Messages**: Don't expose sensitive blockchain details to users

## Testing

### 1. Test with Dummy Data
```bash
# Deploy with dummy wallets
npm run deploy:dummy

# Get contract address and update .env.local
CONTRACT_ADDRESS=0x... npm run simulate
```

### 2. Frontend Testing
```typescript
// __tests__/escrow.test.ts
import { EscrowService } from '../lib/contract';

describe('EscrowService', () => {
  it('should fetch order details', async () => {
    const service = new EscrowService();
    const details = await service.getOrderDetails();
    expect(details.trackingId).toBeDefined();
  });
});
```