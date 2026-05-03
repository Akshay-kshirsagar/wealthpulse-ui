import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { PageHeader } from '../../shared/page-header/page-header';
import { PortfolioService } from '../portfolio.service';

@Component({
  selector: 'app-client-portfolio',
  imports: [AsyncPipe, CurrencyPipe, PageHeader],
  template: `
    <main class="module-shell">
      @if (portfolio$ | async; as portfolio) {
        <app-page-header [title]="portfolio.clientName" eyebrow="Client Portfolio" />
        <section class="grid cards">
          <article class="card"><span>Client ID</span><strong>{{ portfolio.clientId }}</strong></article>
          <article class="card"><span>Value</span><strong>{{ portfolio.value | currency: 'INR':'symbol':'1.0-0' }}</strong></article>
          <article class="card"><span>Risk</span><strong>{{ portfolio.riskProfile }}</strong></article>
        </section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientPortfolioPage {
  private readonly route = inject(ActivatedRoute);
  private readonly portfolioService = inject(PortfolioService);
  protected readonly portfolio$ = this.route.paramMap.pipe(switchMap((params) => this.portfolioService.getClientPortfolio(params.get('clientId') ?? '')));
}
