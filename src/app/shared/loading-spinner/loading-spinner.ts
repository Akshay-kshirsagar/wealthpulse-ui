import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: '<div class="spinner" role="status" aria-label="Loading"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinner {}
