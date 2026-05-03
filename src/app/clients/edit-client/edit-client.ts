import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { PageHeader } from '../../shared/page-header/page-header';
import { ToastService } from '../../shared/toast.service';
import { RiskProfile } from '../client.models';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-edit-client',
  imports: [AsyncPipe, PageHeader, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-client.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditClient {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientService = inject(ClientService);
  private readonly toastService = inject(ToastService);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    pan: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    riskProfile: this.formBuilder.nonNullable.control<RiskProfile>('Moderate', Validators.required),
    address: ['', Validators.required]
  });
  protected readonly client$ = this.route.paramMap.pipe(
    switchMap((params) => this.clientService.getClientById(params.get('id') ?? '')),
    filter(Boolean),
    tap((client) => this.form.patchValue(client))
  );

  protected submit(id: string): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.clientService.updateClient(id, this.form.getRawValue()).subscribe(() => {
      this.toastService.show('Client updated', 'success');
      void this.router.navigate(['/clients', id]);
    });
  }
}
