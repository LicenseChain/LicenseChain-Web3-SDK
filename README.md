# 🌐 LicenseChain Web3 SDK

[![npm version](https://badge.fury.io/js/@licensechain%2Fweb3-sdk.svg)](https://badge.fury.io/js/@licensechain%2Fweb3-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **Universal Web3 integration for LicenseChain** - Deploy, manage, and verify software licenses across multiple blockchains with a unified API.

## 🌟 Features

### 🔗 **Multi-Chain Support**
- **Ethereum** - Smart contracts and NFTs
- **Polygon** - Layer 2 scaling solution
- **BSC** - Binance Smart Chain
- **Avalanche** - High-performance blockchain
- **Arbitrum** - Optimistic rollup
- **Optimism** - Layer 2 scaling
- **Solana** - High-speed blockchain
- **Polkadot** - Multi-chain network

### 🎯 **Universal API**
- **Unified Interface** - Same API across all chains
- **Chain Abstraction** - Automatic chain detection
- **Cross-Chain Operations** - Seamless multi-chain support
- **Wallet Integration** - MetaMask, WalletConnect, Coinbase Wallet

### 🔐 **Advanced Features**
- **Multi-Signature** - Cross-chain multi-sig support
- **Atomic Swaps** - Cross-chain license transfers
- **Bridge Integration** - Chain-to-chain license bridging
- **Oracle Support** - External data integration

### 🌐 **Web3 Standards**
- **EIP-721** - NFT standard compliance
- **EIP-1155** - Multi-token standard
- **SPL Tokens** - Solana token standard
- **Substrate** - Polkadot standard

## 🚀 Quick Start

### Installation

```bash
npm install @licensechain/web3-sdk
# or
yarn add @licensechain/web3-sdk
# or
pnpm add @licensechain/web3-sdk
```

### Basic Usage

```typescript
import { LicenseChainWeb3 } from '@licensechain/web3-sdk';

// Initialize the SDK
const licenseChain = new LicenseChainWeb3({
  chains: ['ethereum', 'polygon', 'solana'],
  walletProvider: window.ethereum,
  rpcUrls: {
    ethereum: process.env.ETHEREUM_RPC_URL,
    polygon: process.env.POLYGON_RPC_URL,
    solana: process.env.SOLANA_RPC_URL
  }
});

// Deploy license contracts across chains
const contracts = await licenseChain.deployMultiChainLicenses({
  name: 'My Software License',
  symbol: 'MSL',
  baseURI: 'https://api.myapp.com/licenses/',
  maxSupply: 10000
});

// Create a license on Ethereum
const ethereumLicense = await contracts.ethereum.createLicense({
  to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  tokenId: 1,
  metadata: {
    software: 'MyApp Pro',
    version: '2.0.0',
    features: ['premium', 'unlimited']
  }
});

// Create a license on Solana
const solanaLicense = await contracts.solana.createLicense({
  owner: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  metadata: {
    software: 'MyApp Pro',
    version: '2.0.0',
    features: ['premium', 'unlimited']
  }
});

// Verify licenses across chains
const ethereumValid = await contracts.ethereum.verifyLicense(1);
const solanaValid = await contracts.solana.verifyLicense(solanaLicense.publicKey);
```

## 📚 API Reference

### LicenseChainWeb3

#### Constructor Options

```typescript
interface Web3Config {
  chains: ChainType[];
  walletProvider?: any;
  rpcUrls?: Record<string, string>;
  privateKeys?: Record<string, string>;
  gasPrices?: Record<string, string>;
  confirmations?: Record<string, number>;
}

type ChainType = 'ethereum' | 'polygon' | 'bsc' | 'avalanche' | 'arbitrum' | 'optimism' | 'solana' | 'polkadot';
```

#### Methods

##### `deployMultiChainLicenses(options)`
Deploy license contracts across multiple chains.

```typescript
interface DeployOptions {
  name: string;
  symbol: string;
  baseURI: string;
  maxSupply?: number;
  royaltyRecipient?: string;
  royaltyFee?: number;
}

const contracts = await licenseChain.deployMultiChainLicenses({
  name: 'My Software License',
  symbol: 'MSL',
  baseURI: 'https://api.myapp.com/licenses/',
  maxSupply: 10000
});
```

##### `getChainContracts(chain)`
Get contracts for a specific chain.

```typescript
const ethereumContracts = await licenseChain.getChainContracts('ethereum');
const solanaContracts = await licenseChain.getChainContracts('solana');
```

##### `bridgeLicense(fromChain, toChain, licenseId)`
Bridge a license from one chain to another.

```typescript
const bridgeResult = await licenseChain.bridgeLicense(
  'ethereum',
  'polygon',
  '1' // license ID
);
```

### Chain Contracts

#### Ethereum/Polygon/BSC/Avalanche/Arbitrum/Optimism

```typescript
// Create license
const license = await contract.createLicense({
  to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  tokenId: 1,
  metadata: { software: 'MyApp', version: '1.0.0', features: ['basic'] }
});

// Verify license
const isValid = await contract.verifyLicense(1);

// Transfer license
const transferResult = await contract.transferLicense(
  '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  '0x8ba1f109551bD432803012645Hac136c4c8c4c8c',
  1
);
```

#### Solana

```typescript
// Create license
const license = await contract.createLicense({
  owner: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  metadata: { software: 'MyApp', version: '1.0.0', features: ['basic'] }
});

// Verify license
const isValid = await contract.verifyLicense(license.publicKey);

// Transfer license
const transferResult = await contract.transferLicense(
  '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  '9yKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsV',
  license.publicKey
);
```

## 🔧 Advanced Features

### Cross-Chain Operations

```typescript
// Atomic swap between chains
const swapResult = await licenseChain.atomicSwap({
  fromChain: 'ethereum',
  toChain: 'polygon',
  licenseId: '1',
  recipient: '0x8ba1f109551bD432803012645Hac136c4c8c4c8c'
});

// Cross-chain license verification
const crossChainValid = await licenseChain.verifyCrossChainLicense({
  chains: ['ethereum', 'polygon'],
  licenseId: '1'
});
```

### Multi-Signature Support

```typescript
// Deploy multi-sig across chains
const multiSigContracts = await licenseChain.deployMultiSigLicenses({
  name: 'MultiSig License',
  symbol: 'MSL',
  baseURI: 'https://api.myapp.com/licenses/',
  requiredSignatures: 3,
  signers: [
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    '0x8ba1f109551bD432803012645Hac136c4c8c4c8c',
    '0x9ca2f210662cE543914123756Ibd247d5d9d5d9d'
  ]
});
```

### Bridge Integration

```typescript
// Bridge license from Ethereum to Polygon
const bridgeResult = await licenseChain.bridgeLicense({
  fromChain: 'ethereum',
  toChain: 'polygon',
  licenseId: '1',
  bridgeContract: '0x...', // Bridge contract address
  gasLimit: 500000
});

// Monitor bridge status
const status = await licenseChain.getBridgeStatus(bridgeResult.txHash);
```

## 🌐 Chain Configuration

### Supported Chains

| Chain | Type | RPC URL | Explorer |
|-------|------|---------|----------|
| Ethereum | EVM | https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY | https://etherscan.io |
| Polygon | EVM | https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY | https://polygonscan.com |
| BSC | EVM | https://bsc-dataseed.binance.org | https://bscscan.com |
| Avalanche | EVM | https://api.avax.network/ext/bc/C/rpc | https://snowtrace.io |
| Arbitrum | EVM | https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY | https://arbiscan.io |
| Optimism | EVM | https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY | https://optimistic.etherscan.io |
| Solana | Non-EVM | https://api.mainnet-beta.solana.com | https://explorer.solana.com |
| Polkadot | Substrate | wss://rpc.polkadot.io | https://polkadot.js.org/apps |

### Custom Chain

```typescript
const licenseChain = new LicenseChainWeb3({
  chains: ['custom'],
  rpcUrls: {
    custom: 'https://your-custom-rpc.com'
  },
  chainConfigs: {
    custom: {
      chainId: 12345,
      name: 'Custom Chain',
      explorerUrl: 'https://explorer.custom.com'
    }
  }
});
```

## 🔒 Security Best Practices

### Wallet Integration

```typescript
// MetaMask integration
const licenseChain = new LicenseChainWeb3({
  chains: ['ethereum', 'polygon'],
  walletProvider: window.ethereum
});

// WalletConnect integration
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

const walletConnect = new WalletConnectConnector({
  rpc: {
    1: process.env.ETHEREUM_RPC_URL,
    137: process.env.POLYGON_RPC_URL
  }
});

const licenseChain = new LicenseChainWeb3({
  chains: ['ethereum', 'polygon'],
  walletProvider: walletConnect
});
```

### Gas Optimization

```typescript
// Set gas prices for each chain
const licenseChain = new LicenseChainWeb3({
  chains: ['ethereum', 'polygon'],
  gasPrices: {
    ethereum: '20', // gwei
    polygon: '30'   // gwei
  }
});

// Estimate gas across chains
const gasEstimates = await licenseChain.estimateGasMultiChain({
  operation: 'createLicense',
  chains: ['ethereum', 'polygon']
});
```

## 📊 Error Handling

```typescript
import { LicenseChainError, ErrorCodes } from '@licensechain/web3-sdk';

try {
  const contracts = await licenseChain.deployMultiChainLicenses(options);
} catch (error) {
  if (error instanceof LicenseChainError) {
    switch (error.code) {
      case ErrorCodes.CHAIN_NOT_SUPPORTED:
        console.error('Chain not supported:', error.details.chain);
        break;
      case ErrorCodes.WALLET_NOT_CONNECTED:
        console.error('Wallet not connected');
        break;
      case ErrorCodes.INSUFFICIENT_FUNDS:
        console.error('Insufficient funds for gas');
        break;
      case ErrorCodes.BRIDGE_FAILED:
        console.error('Bridge operation failed:', error.details);
        break;
      default:
        console.error('Unknown error:', error.message);
    }
  }
}
```

## 🧪 Testing

```typescript
import { LicenseChainWeb3 } from '@licensechain/web3-sdk';

describe('LicenseChain Web3 SDK', () => {
  let licenseChain: LicenseChainWeb3;

  beforeEach(async () => {
    licenseChain = new LicenseChainWeb3({
      chains: ['ethereum', 'polygon'],
      privateKeys: {
        ethereum: process.env.ETHEREUM_PRIVATE_KEY,
        polygon: process.env.POLYGON_PRIVATE_KEY
      }
    });
  });

  it('should deploy contracts across chains', async () => {
    const contracts = await licenseChain.deployMultiChainLicenses({
      name: 'Test License',
      symbol: 'TL',
      baseURI: 'https://test.com/'
    });

    expect(contracts.ethereum).toBeDefined();
    expect(contracts.polygon).toBeDefined();
  });

  it('should bridge license between chains', async () => {
    const bridgeResult = await licenseChain.bridgeLicense(
      'ethereum',
      'polygon',
      '1'
    );

    expect(bridgeResult.txHash).toBeDefined();
    expect(bridgeResult.status).toBe('pending');
  });
});
```

## 📦 Package Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "deploy:all": "ts-node scripts/deploy-all-chains.ts",
    "deploy:ethereum": "ts-node scripts/deploy-ethereum.ts",
    "deploy:polygon": "ts-node scripts/deploy-polygon.ts",
    "deploy:solana": "ts-node scripts/deploy-solana.ts"
  }
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/LicenseChain/LicenseChain-Web3-SDK.git
cd LicenseChain-Web3-SDK
npm install
npm run build
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation](https://docs.licensechain.app/web3-sdk)
- [GitHub Repository](https://github.com/LicenseChain/LicenseChain-Web3-SDK)
- [NPM Package](https://www.npmjs.com/package/@licensechain/web3-sdk)
- [Discord Community](https://discord.gg/licensechain)
- [Twitter](https://twitter.com/licensechain)

## 🆘 Support

- 📧 Email: support@licensechain.app
- 💬 Discord: [LicenseChain Community](https://discord.gg/licensechain)
- 📖 Documentation: [docs.licensechain.app](https://docs.licensechain.app)
- 🐛 Issues: [GitHub Issues](https://github.com/LicenseChain/LicenseChain-Web3-SDK/issues)

---

**Built with ❤️ by the LicenseChain Team**
