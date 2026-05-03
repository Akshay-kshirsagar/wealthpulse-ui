import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="app-nav">
      <a class="app-brand" routerLink="/dashboard" aria-label="WealthPulse dashboard">
        <span aria-hidden="true">W</span>
        WealthPulse
      </a>

      <nav aria-label="Main navigation">
        @for (link of links; track link.path) {
          <a [routerLink]="link.path" routerLinkActive="active">{{ link.label }}</a>
        }
      </nav>

      @if (authService.session(); as session) {
        <section class="profile-summary" aria-label="Signed in profile">
          <div>
            <strong>{{ session.userName || 'WealthPulse User' }}</strong>
            <span>{{ session.userEmail || 'Local session' }}</span>
          </div>
          <button type="button" class="secondary" (click)="logout()">Logout</button>
        </section>
      }
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppNavigation {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly links = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Clients', path: '/clients' },
    { label: 'Billing', path: '/billing' },
    { label: 'Market', path: '/market/watch' },
    { label: 'Portfolio', path: '/portfolio/summary' },
    { label: 'Settings', path: '/settings/profile' }
  ];

  protected logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
