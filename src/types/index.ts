export type CountryCode = "NO" | "SE" | "DK";

export type DocumentLanguage = "nb" | "nn" | "en" | "sv" | "da";

export type DocumentType =
  | "eksamensbesvarelse"
  | "sammendrag"
  | "forelesningsnotater"
  | "oppgaveløsning"
  | "annet";

export type PaymentMethod = "vipps_demo" | "kort_demo" | "stripe_demo";

export type TransactionStatus = "completed" | "failed" | "refunded";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "both";
  university: string;
  country: CountryCode;
  balanceNOK: number;
  joinedAt: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  priceNOK: number;
  sellerId: string;
  university: string;
  country: CountryCode;
  subject: string;
  courseCode: string;
  type: DocumentType;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  previewUrl: string;
  fileName: string;
  tags: string[];
  language: DocumentLanguage;
}

export interface Transaction {
  id: string;
  documentId: string;
  buyerId: string;
  sellerId: string;
  priceNOK: number;
  platformFeeNOK: number;
  sellerRevenueNOK: number;
  createdAt: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
}

export interface Review {
  id: string;
  documentId: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: string;
}

