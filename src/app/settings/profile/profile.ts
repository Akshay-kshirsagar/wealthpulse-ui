import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-profile',
  imports: [PageHeader],
  template: '<main class="module-shell"><app-page-header title="Profile" eyebrow="Settings" /><section class="card"><span>Name</span><strong>Demo Investor</strong></section></main>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Profile {}
