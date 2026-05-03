import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import { DataTable, DataTableColumn } from '../../shared/data-table/data-table';
import { PageHeader } from '../../shared/page-header/page-header';
import { ToastService } from '../../shared/toast.service';
import { Client } from '../client.models';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-clients-list',
  imports: [ConfirmDialog, DataTable, FormsModule, PageHeader, RouterLink],
  templateUrl: './clients-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsList {
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly clients = toSignal(this.clientService.getClients(), { initialValue: [] });

  protected readonly query = signal('');
  protected readonly page = signal(1);
  protected readonly pageSize = 5;
  protected readonly pendingDelete = signal<Client | null>(null);
  protected readonly columns: DataTableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'pan', label: 'PAN' },
    { key: 'email', label: 'Email' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'riskProfile', label: 'Risk' }
  ];
  protected readonly filteredClients = computed(() => {
    const term = this.query().trim().toLowerCase();
    const clients = this.clients();

    if (!term) {
      return clients;
    }

    return clients.filter((client) => `${client.name} ${client.pan} ${client.email} ${client.mobile}`.toLowerCase().includes(term));
  });
  protected readonly pagedClients = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredClients().slice(start, start + this.pageSize);
  });
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredClients().length / this.pageSize)));

  protected updateSearch(value: string): void {
    this.query.set(value);
    this.page.set(1);
  }

  protected nextPage(): void {
    this.page.update((page) => Math.min(this.totalPages(), page + 1));
  }

  protected previousPage(): void {
    this.page.update((page) => Math.max(1, page - 1));
  }

  protected view(row: unknown): void {
    void this.router.navigate(['/clients', (row as Client).id]);
  }

  protected edit(row: unknown): void {
    void this.router.navigate(['/clients', (row as Client).id, 'edit']);
  }

  protected requestDelete(row: unknown): void {
    this.pendingDelete.set(row as Client);
  }

  protected confirmDelete(): void {
    const client = this.pendingDelete();

    if (!client) {
      return;
    }

    this.clientService.deleteClient(client.id).subscribe(() => {
      this.pendingDelete.set(null);
      this.toastService.show('Client deleted', 'success');
    });
  }
}
