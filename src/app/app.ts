import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { AppNavigation } from './shared/app-navigation/app-navigation';
import { ToastAlert } from './shared/toast-alert/toast-alert';

@Component({
  selector: 'app-root',
  imports: [AppNavigation, RouterOutlet, ToastAlert],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly currentUrl = signal(this.router.url);
  protected readonly showNavigation = computed(() => {
    const url = this.currentUrl();
    return this.authService.isAuthenticated() && !url.startsWith('/login') && !url.startsWith('/register');
  });

  constructor() {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
  }
}
