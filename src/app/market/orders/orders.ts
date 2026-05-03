import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataTable, DataTableColumn } from '../../shared/data-table/data-table';
import { PageHeader } from '../../shared/page-header/page-header';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-orders',
  imports: [AsyncPipe, DataTable, PageHeader],
  template: `
    <main class="module-shell">
      <app-page-header title="Orders" eyebrow="Market" />
      @if (orders$ | async; as orders) {
        <section class="panel"><app-data-table [columns]="columns" [rows]="orders" /></section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Orders {
  private readonly marketService = inject(MarketService);
  protected readonly orders$ = this.marketService.getOrders();
  protected readonly columns: DataTableColumn[] = [
    { key: 'id', label: 'Order' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'side', label: 'Side' },
    { key: 'qty', label: 'Qty' },
    { key: 'status', label: 'Status' }
  ];
}
