export interface Web3Config {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface LicenseData {
  id: string;
  userId: string;
  productId: string;
  licenseKey: string;
  status: 'active' | 'inactive' | 'expired' | 'suspended';
  createdAt: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface TransactionResult {
  hash: string;
  blockNumber?: number;
  gasUsed?: string;
  status: 'pending' | 'success' | 'failed';
}

export interface SmartContractCall {
  contractAddress: string;
  method: string;
  parameters: any[];
  value?: string;
  gasLimit?: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface DeFiPosition {
  protocol: string;
  positionType: 'liquidity' | 'lending' | 'staking' | 'farming';
  amount: string;
  value: string;
  apy?: number;
  rewards?: string;
}

export interface CrossChainTransfer {
  fromChain: string;
  toChain: string;
  tokenAddress: string;
  amount: string;
  recipient: string;
  bridgeProtocol?: string;
}

export interface Web3Error extends Error {
  code: string;
  details?: any;
}
