import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Observable, delay, of, switchMap, tap, throwError } from 'rxjs';
import { authConfig } from './auth.config';
import { AuthResponse, AuthSession, LocalAuthUser, LoginCredentials, RegisterCredentials } from './auth.models';

const ACCESS_TOKEN_KEY = 'wealthpulse.accessToken';
const REFRESH_TOKEN_KEY = 'wealthpulse.refreshToken';
const USER_EMAIL_KEY = 'wealthpulse.userEmail';
const USER_NAME_KEY = 'wealthpulse.userName';
const LOCAL_USERS_KEY = 'wealthpulse.localUsers';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly sessionState = signal<AuthSession | null>(this.readSession());
  private readonly loginUrl = `${authConfig.identityApiBaseUrl}${authConfig.endpoints.login}`;
  private readonly registerUrl = `${authConfig.identityApiBaseUrl}${authConfig.endpoints.register}`;

  readonly session = this.sessionState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.sessionState()?.accessToken));

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const request = authConfig.useLocalAuth
      ? this.localLogin(credentials)
      : this.http.post<AuthResponse>(this.loginUrl, credentials);

    return request.pipe(tap((response) => this.saveSession(response)));
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    const request = authConfig.useLocalAuth
      ? this.localRegister(credentials)
      : this.http.post<AuthResponse>(this.registerUrl, credentials);

    return request.pipe(tap((response) => this.saveSession(response)));
  }

  isAuthEndpoint(url: string): boolean {
    return url.includes(this.loginUrl) || url.includes(this.registerUrl);
  }

  logout(): void {
    this.sessionState.set(null);

    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_NAME_KEY);
  }

  getAccessToken(): string | null {
    return this.sessionState()?.accessToken ?? null;
  }

  private saveSession(response: AuthResponse): void {
    const userEmail = this.readTokenClaim(response.accessToken, 'email');
    const userName = this.readTokenClaim(response.accessToken, 'name');
    const session: AuthSession = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken ?? null,
      userEmail,
      userName
    };

    this.sessionState.set(session);

    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    this.setOptionalStorageValue(USER_EMAIL_KEY, session.userEmail);
    this.setOptionalStorageValue(USER_NAME_KEY, session.userName);

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
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
      userEmail: localStorage.getItem(USER_EMAIL_KEY),
      userName: localStorage.getItem(USER_NAME_KEY)
    };
  }

  private localLogin(credentials: LoginCredentials): Observable<AuthResponse> {
    return of(null).pipe(
      delay(350),
      switchMap(() => {
        const user = this.readLocalUsers().find(
          (item) => item.email.toLowerCase() === credentials.email.toLowerCase() && item.password === credentials.password
        );

        if (!user) {
          return throwError(() => new Error('INVALID_CREDENTIALS'));
        }

        return of(this.createLocalAuthResponse(user));
      })
    );
  }

  private localRegister(credentials: RegisterCredentials): Observable<AuthResponse> {
    return of(null).pipe(
      delay(350),
      switchMap(() => {
        const users = this.readLocalUsers();
        const email = credentials.email.toLowerCase();

        if (users.some((user) => user.email.toLowerCase() === email)) {
          return throwError(() => new Error('EMAIL_EXISTS'));
        }

        const user: LocalAuthUser = {
          id: this.createId(),
          name: credentials.name.trim(),
          email,
          password: credentials.password
        };

        this.writeLocalUsers([...users, user]);

        return of(this.createLocalAuthResponse(user));
      })
    );
  }

  private readLocalUsers(): LocalAuthUser[] {
    if (!this.isBrowser) {
      return [];
    }

    const storedUsers = localStorage.getItem(LOCAL_USERS_KEY);

    if (!storedUsers) {
      return [
        {
          id: 'demo-user',
          name: 'Demo Investor',
          email: 'demo@wealthpulse.test',
          password: 'Password123'
        }
      ];
    }

    try {
      const parsedUsers: unknown = JSON.parse(storedUsers);

      if (!Array.isArray(parsedUsers)) {
        return [];
      }

      return parsedUsers.filter((user): user is LocalAuthUser => this.isLocalAuthUser(user));
    } catch {
      return [];
    }
  }

  private writeLocalUsers(users: LocalAuthUser[]): void {
    if (this.isBrowser) {
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    }
  }

  private isLocalAuthUser(user: unknown): user is LocalAuthUser {
    if (!user || typeof user !== 'object') {
      return false;
    }

    const candidate = user as Record<string, unknown>;

    return (
      typeof candidate['id'] === 'string' &&
      typeof candidate['name'] === 'string' &&
      typeof candidate['email'] === 'string' &&
      typeof candidate['password'] === 'string'
    );
  }

  private createLocalAuthResponse(user: LocalAuthUser): AuthResponse {
    return {
      accessToken: this.createLocalJwt(user),
      refreshToken: `local-refresh-${user.id}-${Date.now()}`
    };
  }

  private createLocalJwt(user: LocalAuthUser): string {
    const header = this.toBase64Url({ alg: 'none', typ: 'JWT' });
    const payload = this.toBase64Url({
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000)
    });

    return `${header}.${payload}.local`;
  }

  private toBase64Url(value: Record<string, string | number>): string {
    const json = JSON.stringify(value);

    if (!this.isBrowser) {
      return '';
    }

    return btoa(json).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
  }

  private readTokenClaim(token: string, claim: 'email' | 'name'): string | null {
    if (!this.isBrowser) {
      return null;
    }

    const [, payload] = token.split('.');

    if (!payload) {
      return null;
    }

    try {
      const paddedPayload = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
      const parsedPayload: unknown = JSON.parse(atob(paddedPayload.replaceAll('-', '+').replaceAll('_', '/')));

      if (!parsedPayload || typeof parsedPayload !== 'object') {
        return null;
      }

      const value = (parsedPayload as Record<string, unknown>)[claim];

      return typeof value === 'string' ? value : null;
    } catch {
      return null;
    }
  }

  private setOptionalStorageValue(key: string, value: string | null): void {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  }

  private createId(): string {
    if (this.isBrowser && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `local-${Date.now()}`;
  }
}
