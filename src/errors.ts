export class Web3Error extends Error {
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'Web3Error';
    this.code = code;
    this.details = details;
  }
}

export class NetworkError extends Web3Error {
  constructor(message: string, details?: any) {
    super(message, 'NETWORK_ERROR', details);
    this.name = 'NetworkError';
  }
}

export class ContractError extends Web3Error {
  constructor(message: string, details?: any) {
    super(message, 'CONTRACT_ERROR', details);
    this.name = 'ContractError';
  }
}

export class TransactionError extends Web3Error {
  constructor(message: string, details?: any) {
    super(message, 'TRANSACTION_ERROR', details);
    this.name = 'TransactionError';
  }
}

export class ValidationError extends Web3Error {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Web3Error {
  constructor(message: string, details?: any) {
    super(message, 'AUTHENTICATION_ERROR', details);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends Web3Error {
  constructor(message: string, details?: any) {
    super(message, 'RATE_LIMIT_ERROR', details);
    this.name = 'RateLimitError';
  }
}
