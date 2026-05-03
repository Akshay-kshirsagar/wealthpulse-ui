export interface IndexQuote {
  name: string;
  value: number;
  change: number;
}

export interface Mover {
  symbol: string;
  price: number;
  change: number;
}

export interface Holding {
  symbol: string;
  qty: number;
  avgPrice: number;
  ltp: number;
  pnl: number;
  dayChange: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: 'Buy' | 'Sell';
  qty: number;
  status: string;
}

export interface Position {
  symbol: string;
  qty: number;
  pnl: number;
}
