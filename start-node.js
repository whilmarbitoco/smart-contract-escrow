#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting Hardhat node...');
console.log('Working directory:', __dirname);
console.log('Node version:', process.version);

const hardhatPath = join(__dirname, 'node_modules', '.bin', 'hardhat');

const child = spawn('node', [hardhatPath, 'node', '--hostname', '0.0.0.0', '--port', '8545'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

child.on('error', (error) => {
  console.error('Failed to start Hardhat node:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Hardhat node exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  child.kill('SIGTERM');
});