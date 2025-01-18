export interface Meeting {
  id: string;
  title: string;
  date: Date;
  salesRepId: string;
  notes?: string;
  products: string[];
  tastingNotes?: TastingNotes;
}

export interface SalesRep {
  id: string;
  name: string;
  company: string;
  portfolio: string[];
  image: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  region: string;
  trending: boolean;
  sales: number;
  stock?: number;
  vintage?: string;
}

export interface TastingNotes {
  appearance?: string;
  nose?: string;
  palate?: string;
  rating?: number;
  goals?: string[];
  feedback?: string;
}

export interface Promotion {
  id: string;
  productId: string;
  type: 'discount' | 'bundle' | 'special-offer';
  description: string;
  startDate: Date;
  endDate: Date;
  discount?: number;
  minimumPurchase?: number;
  targetSales: number;
  currentSales: number;
}