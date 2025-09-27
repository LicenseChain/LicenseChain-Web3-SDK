import { Web3Error } from './errors';

export function validateAddress(address: string): boolean {
  // Basic Ethereum address validation
  if (address.startsWith('0x') && address.length === 42) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  
  // Basic Solana address validation
  if (address.length >= 32 && address.length <= 44) {
    return /^[1-9A-HJ-NP-Za-km-z]+$/.test(address);
  }
  
  return false;
}

export function validatePrivateKey(privateKey: string): boolean {
  // Ethereum private key validation
  if (privateKey.startsWith('0x') && privateKey.length === 66) {
    return /^0x[a-fA-F0-9]{64}$/.test(privateKey);
  }
  
  // Raw private key validation
  if (privateKey.length === 64) {
    return /^[a-fA-F0-9]{64}$/.test(privateKey);
  }
  
  return false;
}

export function formatAddress(address: string, chain: string = 'ethereum'): string {
  if (!validateAddress(address)) {
    throw new Web3Error('Invalid address format', 'INVALID_ADDRESS');
  }
  
  switch (chain.toLowerCase()) {
    case 'ethereum':
    case 'polygon':
    case 'bsc':
    case 'avalanche':
    case 'arbitrum':
    case 'optimism':
      return address.toLowerCase();
    case 'solana':
      return address;
    default:
      return address;
  }
}

export function parseUnits(value: string, decimals: number = 18): string {
  const [integer, fraction = ''] = value.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return integer + paddedFraction;
}

export function formatUnits(value: string, decimals: number = 18): string {
  const paddedValue = value.padStart(decimals + 1, '0');
  const integer = paddedValue.slice(0, -decimals);
  const fraction = paddedValue.slice(-decimals).replace(/0+$/, '');
  
  if (fraction) {
    return `${integer}.${fraction}`;
  }
  return integer;
}

export function calculateGasPrice(baseGasPrice: string, multiplier: number = 1.1): string {
  const price = BigInt(baseGasPrice);
  const adjustedPrice = (price * BigInt(Math.floor(multiplier * 1000))) / BigInt(1000);
  return adjustedPrice.toString();
}

export function estimateGasLimit(operation: string, complexity: number = 1): number {
  const baseGasLimits: Record<string, number> = {
    'transfer': 21000,
    'contract_call': 100000,
    'contract_deploy': 500000,
    'complex_operation': 200000
  };
  
  const baseGas = baseGasLimits[operation] || 100000;
  return Math.floor(baseGas * complexity);
}

export function generateRandomBytes(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function hashMessage(message: string): string {
  // Simple hash function - in production, use a proper cryptographic hash
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const attempt = async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        attempts++;
        if (attempts >= maxRetries) {
          reject(error);
        } else {
          setTimeout(attempt, delay * attempts);
        }
      }
    };
    
    attempt();
  });
}

export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input.replace(/[<>\"'&]/g, (match) => {
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return escapeMap[match];
    });
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

export function createWebhookSignature(payload: string, secret: string): string {
  // Simple HMAC implementation - in production, use crypto.subtle
  const encoder = new TextEncoder();
  const key = encoder.encode(secret);
  const data = encoder.encode(payload);
  
  // This is a simplified version - use proper HMAC in production
  return btoa(Array.from(data).map((byte, i) => 
    String.fromCharCode(byte ^ key[i % key.length])
  ).join(''));
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = createWebhookSignature(payload, secret);
  return signature === expectedSignature;
}
