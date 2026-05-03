import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-system-settings',
  imports: [PageHeader],
  template: '<main class="module-shell"><app-page-header title="System Settings" eyebrow="Settings" /><section class="grid cards"><article class="card"><span>API Gateway</span><strong>/api/gateway</strong></article><article class="card"><span>Environment</span><strong>Local fallback</strong></article></section></main>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemSettings {}
