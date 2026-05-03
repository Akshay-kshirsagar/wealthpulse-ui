import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { PageHeader } from '../shared/page-header/page-header';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, CurrencyPipe, DecimalPipe, PageHeader, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  protected readonly vm$ = combineLatest({
    summary: this.dashboardService.getSummary(),
    revenue: this.dashboardService.getRevenueChart(),
    growth: this.dashboardService.getClientGrowth(),
    stats: this.dashboardService.getPortfolioStats()
  });
}
