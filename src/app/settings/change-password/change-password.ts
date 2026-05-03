import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-change-password',
  imports: [PageHeader, ReactiveFormsModule],
  template: '<main class="module-shell"><app-page-header title="Change Password" eyebrow="Settings" /><section class="form-panel">Password change endpoint ready for identity API.</section></main>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePassword {}
