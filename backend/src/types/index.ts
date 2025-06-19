import { Request } from 'express';

export interface User {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarBuyoutForm {
  brand: string;
  model: string;
  year: number;
  desiredPrice: number;
  phone: string;
}

export interface CarImportForm {
  carType: string;
  budget: number;
  deliveryCity: string;
  name: string;
  phone: string;
}

export interface Advertisement {
  _id: string;
  userId: string;
  brand: string;
  carModel: string;
  year: number;
  price: number;
  description: string;
  contacts: string;
  photoUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  moderationComment?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetNameBuyout: string;
  sheetNameKorea: string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
} 