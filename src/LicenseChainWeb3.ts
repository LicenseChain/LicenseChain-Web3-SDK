import { Web3Config, ChainConfig, LicenseData, TransactionResult, SmartContractCall, CrossChainTransfer } from './types';
import { Web3Error, NetworkError, ContractError, TransactionError } from './errors';
import { MultiChainManager } from './MultiChainManager';
import { EthereumProvider } from './providers/EthereumProvider';
import { PolygonProvider } from './providers/PolygonProvider';
import { BSCProvider } from './providers/BSCProvider';
import { AvalancheProvider } from './providers/AvalancheProvider';
import { ArbitrumProvider } from './providers/ArbitrumProvider';
import { OptimismProvider } from './providers/OptimismProvider';
import { SolanaProvider } from './providers/SolanaProvider';
import { PolkadotProvider } from './providers/PolkadotProvider';

export class LicenseChainWeb3 {
  private config: Web3Config;
  private multiChainManager: MultiChainManager;

  constructor(config: Web3Config) {
    this.config = {
      baseUrl: 'https://api.licensechain.app',
      timeout: 30000,
      retries: 3,
      ...config
    };
    
    this.multiChainManager = new MultiChainManager(this.config);
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize all blockchain providers
    this.multiChainManager.addProvider('ethereum', new EthereumProvider(this.config));
    this.multiChainManager.addProvider('polygon', new PolygonProvider(this.config));
    this.multiChainManager.addProvider('bsc', new BSCProvider(this.config));
    this.multiChainManager.addProvider('avalanche', new AvalancheProvider(this.config));
    this.multiChainManager.addProvider('arbitrum', new ArbitrumProvider(this.config));
    this.multiChainManager.addProvider('optimism', new OptimismProvider(this.config));
    this.multiChainManager.addProvider('solana', new SolanaProvider(this.config));
    this.multiChainManager.addProvider('polkadot', new PolkadotProvider(this.config));
  }

  // License Management
  async createLicense(userId: string, productId: string, metadata?: Record<string, any>): Promise<LicenseData> {
    try {
      const response = await this.makeRequest('POST', '/licenses', {
        userId,
        productId,
        metadata
      });
      return response.data;
    } catch (error) {
      throw new Web3Error('Failed to create license', 'LICENSE_CREATE_ERROR', error);
    }
  }

  async getLicense(licenseId: string): Promise<LicenseData> {
    try {
      const response = await this.makeRequest('GET', `/licenses/${licenseId}`);
      return response.data;
    } catch (error) {
      throw new Web3Error('Failed to get license', 'LICENSE_GET_ERROR', error);
    }
  }

  async validateLicense(licenseKey: string): Promise<boolean> {
    try {
      const response = await this.makeRequest('POST', '/licenses/validate', {
        licenseKey
      });
      return response.data.valid;
    } catch (error) {
      throw new Web3Error('Failed to validate license', 'LICENSE_VALIDATE_ERROR', error);
    }
  }

  async updateLicense(licenseId: string, updates: Partial<LicenseData>): Promise<LicenseData> {
    try {
      const response = await this.makeRequest('PUT', `/licenses/${licenseId}`, updates);
      return response.data;
    } catch (error) {
      throw new Web3Error('Failed to update license', 'LICENSE_UPDATE_ERROR', error);
    }
  }

  async revokeLicense(licenseId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest('DELETE', `/licenses/${licenseId}`);
      return response.data.success;
    } catch (error) {
      throw new Web3Error('Failed to revoke license', 'LICENSE_REVOKE_ERROR', error);
    }
  }

  // Blockchain Operations
  async getBalance(address: string, chain: string = 'ethereum'): Promise<string> {
    try {
      return await this.multiChainManager.getBalance(address, chain);
    } catch (error) {
      throw new Web3Error('Failed to get balance', 'BALANCE_ERROR', error);
    }
  }

  async sendTransaction(to: string, amount: string, chain: string = 'ethereum'): Promise<TransactionResult> {
    try {
      return await this.multiChainManager.sendTransaction(to, amount, chain);
    } catch (error) {
      throw new TransactionError('Failed to send transaction', error);
    }
  }

  async callContract(call: SmartContractCall, chain: string = 'ethereum'): Promise<any> {
    try {
      return await this.multiChainManager.callContract(call, chain);
    } catch (error) {
      throw new ContractError('Failed to call contract', error);
    }
  }

  async deployContract(bytecode: string, abi: any[], constructorArgs: any[] = [], chain: string = 'ethereum'): Promise<string> {
    try {
      return await this.multiChainManager.deployContract(bytecode, abi, constructorArgs, chain);
    } catch (error) {
      throw new ContractError('Failed to deploy contract', error);
    }
  }

  // Cross-chain Operations
  async transferCrossChain(transfer: CrossChainTransfer): Promise<TransactionResult> {
    try {
      return await this.multiChainManager.transferCrossChain(transfer);
    } catch (error) {
      throw new TransactionError('Failed to transfer cross-chain', error);
    }
  }

  async getSupportedChains(): Promise<string[]> {
    return this.multiChainManager.getSupportedChains();
  }

  async getChainConfig(chain: string): Promise<ChainConfig> {
    return this.multiChainManager.getChainConfig(chain);
  }

  // Utility Methods
  private async makeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    // Ensure endpoint starts with /v1 prefix
    const normalizedEndpoint = endpoint.startsWith('/v1/') 
      ? endpoint 
      : endpoint.startsWith('/') 
        ? `/v1${endpoint}`
        : `/v1/${endpoint}`;
    
    const url = `${this.config.baseUrl}${normalizedEndpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-API-Version': '1.0'
      },
      signal: AbortSignal.timeout(this.config.timeout!)
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new NetworkError(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof NetworkError) {
        throw error;
      }
      throw new NetworkError('Network request failed', error);
    }
  }

  // Event Listeners
  on(event: string, callback: (data: any) => void): void {
    this.multiChainManager.on(event, callback);
  }

  off(event: string, callback: (data: any) => void): void {
    this.multiChainManager.off(event, callback);
  }

  // Cleanup
  async disconnect(): Promise<void> {
    await this.multiChainManager.disconnect();
  }
}
