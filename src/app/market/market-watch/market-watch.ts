import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { PageHeader } from '../../shared/page-header/page-header';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-market-watch',
  imports: [AsyncPipe, DecimalPipe, PageHeader],
  templateUrl: './market-watch.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketWatch {
  private readonly marketService = inject(MarketService);
  protected readonly vm$ = combineLatest({
    indices: this.marketService.getIndices(),
    gainers: this.marketService.getTopGainers(),
    losers: this.marketService.getTopLosers()
  });
}
