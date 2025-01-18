import { Meeting, SalesRep, Product, Promotion } from './types';

export const meetings: Meeting[] = [
  {
    id: '1',
    title: 'French Wines Portfolio Review',
    date: new Date(2024, 2, 20, 14, 0),
    salesRepId: '1',
    notes: 'Discussing new Bordeaux vintages and upcoming releases',
    products: ['1', '2']
  },
  {
    id: '2',
    title: 'Italian Wines Tasting',
    date: new Date(2024, 2, 21, 10, 0),
    salesRepId: '2',
    notes: 'Focus on Tuscan wines and market trends',
    products: ['3', '4']
  },
  {
    id: '3',
    title: 'Champagne Season Planning',
    date: new Date(2024, 2, 20, 11, 30),
    salesRepId: '3',
    notes: 'Planning for upcoming holiday season',
    products: ['2', '8']
  },
  {
    id: '4',
    title: 'New Spanish Imports Review',
    date: new Date(2024, 2, 22, 15, 0),
    salesRepId: '4',
    notes: 'Introducing new Rioja and Ribera del Duero selections',
    products: ['5', '6']
  },
  {
    id: '5',
    title: 'Natural Wines Portfolio',
    date: new Date(2024, 2, 21, 14, 30),
    salesRepId: '5',
    notes: 'Exploring organic and biodynamic options',
    products: ['7']
  }
];

export const salesReps: SalesRep[] = [
  {
    id: '1',
    name: 'Sophie Laurent',
    company: 'French Wines Direct',
    portfolio: ['Bordeaux', 'Burgundy', 'Champagne'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '2',
    name: 'Marco Rossi',
    company: 'Italian Wine Imports',
    portfolio: ['Tuscany', 'Piedmont', 'Veneto'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '3',
    name: 'Claire Dubois',
    company: 'Champagne Specialists',
    portfolio: ['Champagne', 'Cremant'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '4',
    name: 'Javier Rodriguez',
    company: 'Spanish Wine Imports',
    portfolio: ['Rioja', 'Ribera del Duero', 'Priorat'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
  },
  {
    id: '5',
    name: 'Emma Green',
    company: 'Natural Wine Co',
    portfolio: ['Natural Wines', 'Organic', 'Biodynamic'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Château Margaux 2019',
    type: 'Red Wine',
    region: 'Bordeaux',
    trending: true,
    sales: 1250,
    stock: 45,
    vintage: '2019'
  },
  {
    id: '2',
    name: 'Dom Pérignon 2012',
    type: 'Champagne',
    region: 'Champagne',
    trending: true,
    sales: 980,
    stock: 24,
    vintage: '2012'
  },
  {
    id: '3',
    name: 'Sassicaia 2018',
    type: 'Red Wine',
    region: 'Tuscany',
    trending: true,
    sales: 750,
    stock: 32,
    vintage: '2018'
  },
  {
    id: '4',
    name: 'Barolo Monfortino 2015',
    type: 'Red Wine',
    region: 'Piedmont',
    trending: false,
    sales: 620,
    stock: 18,
    vintage: '2015'
  },
  {
    id: '5',
    name: 'Vega Sicilia Unico 2011',
    type: 'Red Wine',
    region: 'Ribera del Duero',
    trending: true,
    sales: 450,
    stock: 15,
    vintage: '2011'
  },
  {
    id: '6',
    name: 'La Rioja Alta Gran Reserva 904 2011',
    type: 'Red Wine',
    region: 'Rioja',
    trending: false,
    sales: 580,
    stock: 28,
    vintage: '2011'
  },
  {
    id: '7',
    name: 'Gut Oggau Theodora 2021',
    type: 'Natural Wine',
    region: 'Burgenland',
    trending: true,
    sales: 320,
    stock: 42,
    vintage: '2021'
  },
  {
    id: '8',
    name: 'Krug Grande Cuvée',
    type: 'Champagne',
    region: 'Champagne',
    trending: true,
    sales: 890,
    stock: 36,
    vintage: 'NV'
  }
];

export const promotions: Promotion[] = [
  {
    id: '1',
    productId: '1',
    type: 'discount',
    description: 'Spring Collection Special: 15% off on Château Margaux 2019',
    startDate: new Date(2024, 2, 1),
    endDate: new Date(2024, 4, 30),
    discount: 15,
    minimumPurchase: 6,
    targetSales: 200,
    currentSales: 145
  },
  {
    id: '2',
    productId: '2',
    type: 'bundle',
    description: 'Luxury Bundle: Buy 6 Dom Pérignon 2012, get 1 free',
    startDate: new Date(2024, 2, 15),
    endDate: new Date(2024, 3, 15),
    minimumPurchase: 6,
    targetSales: 150,
    currentSales: 98
  },
  {
    id: '3',
    productId: '3',
    type: 'special-offer',
    description: 'Exclusive Sassicaia 2018 Vertical Tasting Event Access with Purchase',
    startDate: new Date(2024, 2, 10),
    endDate: new Date(2024, 5, 1),
    minimumPurchase: 3,
    targetSales: 100,
    currentSales: 67
  },
  {
    id: '4',
    productId: '8',
    type: 'discount',
    description: 'Prestige Cuvée Week: 10% off Krug Grande Cuvée',
    startDate: new Date(2024, 2, 20),
    endDate: new Date(2024, 3, 20),
    discount: 10,
    targetSales: 120,
    currentSales: 85
  }
];