import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataTable, DataTableColumn } from '../../shared/data-table/data-table';
import { PageHeader } from '../../shared/page-header/page-header';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-holdings',
  imports: [AsyncPipe, DataTable, PageHeader],
  template: `
    <main class="module-shell">
      <app-page-header title="Holdings" eyebrow="Market" />
      @if (holdings$ | async; as holdings) {
        <section class="panel">
          <app-data-table [columns]="columns" [rows]="holdings" />
        </section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Holdings {
  private readonly marketService = inject(MarketService);
  protected readonly holdings$ = this.marketService.getHoldings();
  protected readonly columns: DataTableColumn[] = [
    { key: 'symbol', label: 'Symbol' },
    { key: 'qty', label: 'Qty' },
    { key: 'avgPrice', label: 'Avg Price' },
    { key: 'ltp', label: 'LTP' },
    { key: 'pnl', label: 'PnL' },
    { key: 'dayChange', label: 'Day Change' }
  ];
}
