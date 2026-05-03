import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PageHeader } from '../../shared/page-header/page-header';
import { ToastService } from '../../shared/toast.service';
import { RiskProfile } from '../client.models';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-add-client',
  imports: [PageHeader, ReactiveFormsModule, RouterLink],
  templateUrl: './add-client.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddClient {
  private readonly formBuilder = inject(FormBuilder);
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    pan: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', Validators.required],
    riskProfile: this.formBuilder.nonNullable.control<RiskProfile>('Moderate', Validators.required),
    address: ['', Validators.required]
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.clientService.addClient(this.form.getRawValue()).subscribe((client) => {
      this.toastService.show('Client added', 'success');
      void this.router.navigate(['/clients', client.id]);
    });
  }
}
