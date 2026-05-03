import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PageHeader } from '../../shared/page-header/page-header';
import { ToastService } from '../../shared/toast.service';
import { BillingService } from '../billing.service';

@Component({
  selector: 'app-generate-invoice',
  imports: [PageHeader, ReactiveFormsModule, RouterLink],
  templateUrl: './generate-invoice.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenerateInvoice {
  private readonly formBuilder = inject(FormBuilder);
  private readonly billingService = inject(BillingService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  protected readonly form = this.formBuilder.nonNullable.group({ clientId: ['', Validators.required] });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.billingService.generateInvoice(this.form.controls.clientId.value).subscribe((invoice) => {
      this.toastService.show('Invoice generated', 'success');
      void this.router.navigate(['/billing/invoices', invoice.id]);
    });
  }
}
