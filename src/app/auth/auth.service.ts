import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, AuthSession, LoginCredentials } from './auth.models';

const ACCESS_TOKEN_KEY = 'wealthpulse.accessToken';
const REFRESH_TOKEN_KEY = 'wealthpulse.refreshToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly apiUrl = '/api/auth/login';
  private readonly sessionState = signal<AuthSession | null>(this.readSession());

  readonly session = this.sessionState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.sessionState()?.accessToken));

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
      tap((response) => this.saveSession(response))
    );
  }

  logout(): void {
    this.sessionState.set(null);

    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  getAccessToken(): string | null {
    return this.sessionState()?.accessToken ?? null;
  }

  private saveSession(response: AuthResponse): void {
    const session: AuthSession = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken ?? null
    };

    this.sessionState.set(session);

    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);

    if (session.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  private readSession(): AuthSession | null {
    if (!this.isBrowser) {
      return null;
    }

    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!accessToken) {
      return null;
    }

    return {
      accessToken,
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY)
    };
  }
}
