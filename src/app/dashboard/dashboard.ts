import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

interface NavigationItem {
  label: string;
  icon: 'overview' | 'accounts' | 'investments' | 'budgets' | 'reports';
  active: boolean;
}

interface KpiCard {
  label: string;
  value: string;
  delta: string;
  direction: 'up' | 'down';
  detail: string;
}

interface AllocationSegment {
  label: string;
  value: number;
  color: string;
}

interface Holding {
  symbol: string;
  name: string;
  value: string;
  weight: string;
  change: string;
  direction: 'up' | 'down';
}

interface Activity {
  title: string;
  meta: string;
  amount: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navigationItems: NavigationItem[] = [
    { label: 'Overview', icon: 'overview', active: true },
    { label: 'Accounts', icon: 'accounts', active: false },
    { label: 'Investments', icon: 'investments', active: false },
    { label: 'Budgets', icon: 'budgets', active: false },
    { label: 'Reports', icon: 'reports', active: false }
  ];

  protected readonly kpis: KpiCard[] = [
    {
      label: 'Net worth',
      value: '$842,390',
      delta: '+8.4%',
      direction: 'up',
      detail: 'vs. last month'
    },
    {
      label: 'Monthly cash flow',
      value: '$12,860',
      delta: '+$1,240',
      direction: 'up',
      detail: 'projected surplus'
    },
    {
      label: 'Portfolio return',
      value: '14.2%',
      delta: '+2.1%',
      direction: 'up',
      detail: 'year to date'
    },
    {
      label: 'Risk exposure',
      value: 'Medium',
      delta: '-3.8%',
      direction: 'down',
      detail: 'volatility change'
    }
  ];

  protected readonly linePoints = '0,142 74,118 148,126 222,82 296,96 370,54 444,68 518,24 592,38';
  protected readonly linePointCoordinates = this.linePoints.split(' ').map((point) => {
    const [x, y] = point.split(',');

    return { x, y };
  });

  protected readonly cashflowBars = [
    { month: 'Jan', income: 132, spend: 88 },
    { month: 'Feb', income: 120, spend: 96 },
    { month: 'Mar', income: 148, spend: 102 },
    { month: 'Apr', income: 142, spend: 86 },
    { month: 'May', income: 168, spend: 108 },
    { month: 'Jun', income: 156, spend: 92 }
  ];

  protected readonly allocation: AllocationSegment[] = [
    { label: 'Equities', value: 54, color: '#0f766e' },
    { label: 'Fixed income', value: 22, color: '#2563eb' },
    { label: 'Real estate', value: 14, color: '#b45309' },
    { label: 'Cash', value: 10, color: '#64748b' }
  ];

  protected readonly holdings: Holding[] = [
    { symbol: 'VTI', name: 'Total Stock Market ETF', value: '$184,240', weight: '21.9%', change: '+1.8%', direction: 'up' },
    { symbol: 'BND', name: 'Total Bond Market ETF', value: '$96,810', weight: '11.5%', change: '+0.4%', direction: 'up' },
    { symbol: 'AAPL', name: 'Apple Inc.', value: '$74,660', weight: '8.9%', change: '-0.7%', direction: 'down' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', value: '$68,420', weight: '8.1%', change: '+1.2%', direction: 'up' }
  ];

  protected readonly activities: Activity[] = [
    { title: 'Dividend received', meta: 'VTI distribution', amount: '+$482.16' },
    { title: 'Transfer completed', meta: 'Brokerage contribution', amount: '+$2,500.00' },
    { title: 'Card payment posted', meta: 'Operating account', amount: '-$1,284.92' }
  ];

  protected logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }
}
