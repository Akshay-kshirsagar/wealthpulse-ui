export interface DashboardSummary {
  totalClients: number;
  totalAum: number;
  monthlyRevenue: number;
  pendingBills: number;
  todayPnl: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface PortfolioStat {
  label: string;
  value: string;
  trend: string;
}
