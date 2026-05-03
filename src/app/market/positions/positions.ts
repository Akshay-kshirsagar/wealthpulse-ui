import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataTable, DataTableColumn } from '../../shared/data-table/data-table';
import { PageHeader } from '../../shared/page-header/page-header';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-positions',
  imports: [AsyncPipe, DataTable, PageHeader],
  template: `
    <main class="module-shell">
      <app-page-header title="Positions" eyebrow="Market" />
      @if (positions$ | async; as positions) {
        <section class="panel"><app-data-table [columns]="columns" [rows]="positions" /></section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Positions {
  private readonly marketService = inject(MarketService);
  protected readonly positions$ = this.marketService.getPositions();
  protected readonly columns: DataTableColumn[] = [
    { key: 'symbol', label: 'Symbol' },
    { key: 'qty', label: 'Qty' },
    { key: 'pnl', label: 'PnL' }
  ];
}
