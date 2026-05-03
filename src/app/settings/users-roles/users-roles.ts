import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeader } from '../../shared/page-header/page-header';

@Component({
  selector: 'app-users-roles',
  imports: [PageHeader],
  template: '<main class="module-shell"><app-page-header title="Users & Roles" eyebrow="Settings" /><section class="grid cards"><article class="card"><span>Admin</span><strong>Full access</strong></article><article class="card"><span>Advisor</span><strong>Client and portfolio access</strong></article><article class="card"><span>Viewer</span><strong>Read only</strong></article></section></main>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersRoles {}
