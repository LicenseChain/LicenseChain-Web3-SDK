import { Web3Config, ChainConfig, TransactionResult, SmartContractCall, CrossChainTransfer } from './types';
import { Web3Error, NetworkError, ContractError } from './errors';

export interface BlockchainProvider {
  getBalance(address: string): Promise<string>;
  sendTransaction(to: string, amount: string): Promise<TransactionResult>;
  callContract(call: SmartContractCall): Promise<any>;
  deployContract(bytecode: string, abi: any[], constructorArgs: any[]): Promise<string>;
  getChainConfig(): ChainConfig;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export class MultiChainManager {
  private config: Web3Config;
  private providers: Map<string, BlockchainProvider> = new Map();
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(config: Web3Config) {
    this.config = config;
  }

  addProvider(chain: string, provider: BlockchainProvider): void {
    this.providers.set(chain, provider);
  }

  getProvider(chain: string): BlockchainProvider {
    const provider = this.providers.get(chain);
    if (!provider) {
      throw new Web3Error(`Provider for chain '${chain}' not found`, 'PROVIDER_NOT_FOUND');
    }
    return provider;
  }

  async getBalance(address: string, chain: string): Promise<string> {
    try {
      const provider = this.getProvider(chain);
      await provider.connect();
      return await provider.getBalance(address);
    } catch (error) {
      throw new Web3Error(`Failed to get balance on ${chain}`, 'BALANCE_ERROR', error);
    }
  }

  async sendTransaction(to: string, amount: string, chain: string): Promise<TransactionResult> {
    try {
      const provider = this.getProvider(chain);
      await provider.connect();
      return await provider.sendTransaction(to, amount);
    } catch (error) {
      throw new Web3Error(`Failed to send transaction on ${chain}`, 'TRANSACTION_ERROR', error);
    }
  }

  async callContract(call: SmartContractCall, chain: string): Promise<any> {
    try {
      const provider = this.getProvider(chain);
      await provider.connect();
      return await provider.callContract(call);
    } catch (error) {
      throw new ContractError(`Failed to call contract on ${chain}`, error);
    }
  }

  async deployContract(bytecode: string, abi: any[], constructorArgs: any[], chain: string): Promise<string> {
    try {
      const provider = this.getProvider(chain);
      await provider.connect();
      return await provider.deployContract(bytecode, abi, constructorArgs);
    } catch (error) {
      throw new ContractError(`Failed to deploy contract on ${chain}`, error);
    }
  }

  async transferCrossChain(transfer: CrossChainTransfer): Promise<TransactionResult> {
    try {
      const fromProvider = this.getProvider(transfer.fromChain);
      const toProvider = this.getProvider(transfer.toChain);
      
      await fromProvider.connect();
      await toProvider.connect();

      // Implement cross-chain transfer logic
      // This would typically involve bridge protocols
      const result = await fromProvider.sendTransaction(
        transfer.recipient,
        transfer.amount
      );

      this.emit('crossChainTransfer', {
        ...transfer,
        transactionHash: result.hash
      });

      return result;
    } catch (error) {
      throw new Web3Error('Failed to transfer cross-chain', 'CROSS_CHAIN_ERROR', error);
    }
  }

  getSupportedChains(): string[] {
    return Array.from(this.providers.keys());
  }

  getChainConfig(chain: string): ChainConfig {
    const provider = this.getProvider(chain);
    return provider.getChainConfig();
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  async disconnect(): Promise<void> {
    const disconnectPromises = Array.from(this.providers.values()).map(provider => 
      provider.disconnect().catch(error => 
        console.error('Error disconnecting provider:', error)
      )
    );
    await Promise.all(disconnectPromises);
  }
}
