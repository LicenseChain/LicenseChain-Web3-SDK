import { LicenseChainWeb3 } from '../src/LicenseChainWeb3';
import { Web3Config, SmartContractCall, CrossChainTransfer } from '../src/types';

// Initialize the Web3 SDK
const config: Web3Config = {
  apiKey: 'your-api-key-here',
  baseUrl: 'https://api.licensechain.com',
  timeout: 30000,
  retries: 3
};

const licenseChain = new LicenseChainWeb3(config);

async function basicUsageExample() {
  try {
    console.log('🚀 LicenseChain Web3 SDK - Basic Usage Example');
    console.log('================================================');

    // 1. Create a new license
    console.log('\n1. Creating a new license...');
    const license = await licenseChain.createLicense(
      'user123',
      'product456',
      { 
        features: ['premium', 'api_access'],
        maxUsers: 10 
      }
    );
    console.log('✅ License created:', license);

    // 2. Validate a license
    console.log('\n2. Validating license...');
    const isValid = await licenseChain.validateLicense(license.licenseKey);
    console.log('✅ License valid:', isValid);

    // 3. Get balance on Ethereum
    console.log('\n3. Getting balance on Ethereum...');
    const balance = await licenseChain.getBalance('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'ethereum');
    console.log('✅ ETH Balance:', balance);

    // 4. Send a transaction
    console.log('\n4. Sending transaction...');
    const txResult = await licenseChain.sendTransaction(
      '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      '1000000000000000000', // 1 ETH
      'ethereum'
    );
    console.log('✅ Transaction sent:', txResult);

    // 5. Call a smart contract
    console.log('\n5. Calling smart contract...');
    const contractCall: SmartContractCall = {
      contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      method: 'balanceOf',
      parameters: ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6']
    };
    const contractResult = await licenseChain.callContract(contractCall, 'ethereum');
    console.log('✅ Contract call result:', contractResult);

    // 6. Cross-chain transfer
    console.log('\n6. Cross-chain transfer...');
    const crossChainTransfer: CrossChainTransfer = {
      fromChain: 'ethereum',
      toChain: 'polygon',
      tokenAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      amount: '1000000000000000000',
      recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      bridgeProtocol: 'polygon-bridge'
    };
    const crossChainResult = await licenseChain.transferCrossChain(crossChainTransfer);
    console.log('✅ Cross-chain transfer:', crossChainResult);

    // 7. Get supported chains
    console.log('\n7. Getting supported chains...');
    const supportedChains = await licenseChain.getSupportedChains();
    console.log('✅ Supported chains:', supportedChains);

    // 8. Get chain configuration
    console.log('\n8. Getting chain configuration...');
    const chainConfig = await licenseChain.getChainConfig('ethereum');
    console.log('✅ Ethereum config:', chainConfig);

    console.log('\n🎉 All operations completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Clean up
    await licenseChain.disconnect();
  }
}

// Event handling example
function eventHandlingExample() {
  console.log('\n📡 Setting up event listeners...');
  
  licenseChain.on('crossChainTransfer', (data) => {
    console.log('🔄 Cross-chain transfer event:', data);
  });

  licenseChain.on('transactionConfirmed', (data) => {
    console.log('✅ Transaction confirmed:', data);
  });

  licenseChain.on('error', (error) => {
    console.error('❌ SDK Error:', error);
  });
}

// Run the examples
if (require.main === module) {
  eventHandlingExample();
  basicUsageExample();
}

export { basicUsageExample, eventHandlingExample };
