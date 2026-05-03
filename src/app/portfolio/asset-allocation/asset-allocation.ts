import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DataTable, DataTableColumn } from '../../shared/data-table/data-table';
import { PageHeader } from '../../shared/page-header/page-header';
import { PortfolioService } from '../portfolio.service';

@Component({
  selector: 'app-asset-allocation',
  imports: [AsyncPipe, DataTable, PageHeader],
  template: `
    <main class="module-shell">
      <app-page-header title="Asset Allocation" eyebrow="Portfolio" />
      @if (allocation$ | async; as allocation) {
        <section class="panel"><app-data-table [columns]="columns" [rows]="allocation" /></section>
      }
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssetAllocationPage {
  private readonly portfolioService = inject(PortfolioService);
  protected readonly allocation$ = this.portfolioService.getAssetAllocation();
  protected readonly columns: DataTableColumn[] = [
    { key: 'assetClass', label: 'Asset Class' },
    { key: 'value', label: 'Allocation %' }
  ];
}
