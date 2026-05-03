import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { PageHeader } from '../../shared/page-header/page-header';
import { PortfolioService } from '../portfolio.service';

@Component({
  selector: 'app-portfolio-summary',
  imports: [AsyncPipe, CurrencyPipe, PageHeader],
  templateUrl: './portfolio-summary.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioSummaryPage {
  private readonly portfolioService = inject(PortfolioService);
  protected readonly vm$ = combineLatest({
    summary: this.portfolioService.getPortfolioSummary(),
    returns: this.portfolioService.getReturns()
  });
}
