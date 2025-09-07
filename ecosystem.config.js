module.exports = {
  apps: [{
    name: 'hardhat-node',
    script: './start-node.js',
    cwd: '/home/ubuntu/smart-contract-escrow',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    log_file: './logs/hardhat-node.log',
    out_file: './logs/hardhat-node-out.log',
    error_file: './logs/hardhat-node-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};