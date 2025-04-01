export type UserRole = 'buyer' | 'seller' | 'underwriter' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  walletBalance: number;
  stakedAmount: number;
  walletAddress: string | null;
  onboardingCompleted?: boolean;
}

export interface Invoice {
  id: string;
  sellerId: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'pending' | 'tokenized' | 'fractionalized' | 'paid' | 'financed';
  createdAt: string;
  fileUrl: string;
  description: string;
  clientName?: string;
  clientEmail?: string;
  fractionalized?: boolean;
  totalUnits?: number;
  availableUnits?: number;
  pricePerUnit?: number;
  nftMetadata?: {
    tokenId: string;
    contractAddress: string;
    ownerAddress: string;
    shares: {
      total: number;
      available: number;
      price: number;
    };
    terms: {
      duration: number;
      apy: number;
      minimumInvestment: number;
    };
  };
  financing?: {
    status: 'pending' | 'approved' | 'rejected';
    requestedAmount: number;
    duration: number;
    applicationDate: string;
    approvalDate?: string;
    rejectionDate?: string;
    rejectionReason?: string;
  };
}

export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type TransactionType = 'deposit' | 'withdrawal' | 'stake' | 'purchase' | 'sale' | 'loan';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  timestamp: string;
  description: string;
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
  fee?: number;
  invoiceId?: string;
  units?: number;
  nftMetadata?: {
    tokenId: string;
    contractAddress: string;
    shares?: number;
  };
  loanDetails?: {
    duration: number;
    interestRate: number;
    collateralValue: number;
  };
}