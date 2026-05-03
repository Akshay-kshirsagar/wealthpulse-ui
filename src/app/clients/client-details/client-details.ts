import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { PageHeader } from '../../shared/page-header/page-header';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-details',
  imports: [AsyncPipe, CurrencyPipe, PageHeader, RouterLink],
  templateUrl: './client-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly clientService = inject(ClientService);

  protected readonly client$ = this.route.paramMap.pipe(switchMap((params) => this.clientService.getClientById(params.get('id') ?? '')));
}
