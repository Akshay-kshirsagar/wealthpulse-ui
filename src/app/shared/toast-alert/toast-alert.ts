import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../toast.service';

@Component({
  selector: 'app-toast-alert',
  template: `
    @if (toastService.toast(); as toast) {
      <div class="toast" [class.success]="toast.type === 'success'" [class.error]="toast.type === 'error'" role="status">
        {{ toast.message }}
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastAlert {
  protected readonly toastService = inject(ToastService);
}
