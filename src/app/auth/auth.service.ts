import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, delay, of, switchMap, tap, throwError } from 'rxjs';
import { authConfig } from './auth.config';
import { AuthResponse, AuthSession, LocalAuthUser, LoginCredentials, RegisterCredentials, UserRole } from './auth.models';

const ACCESS_TOKEN_KEY = 'wealthpulse.accessToken';
const REFRESH_TOKEN_KEY = 'wealthpulse.refreshToken';
const USER_EMAIL_KEY = 'wealthpulse.userEmail';
const USER_NAME_KEY = 'wealthpulse.userName';
const USER_ROLES_KEY = 'wealthpulse.userRoles';
const EXPIRES_AT_KEY = 'wealthpulse.expiresAt';
const LOCAL_USERS_KEY = 'wealthpulse.localUsers';
const DEMO_USER: LocalAuthUser = {
  id: 'demo-user',
  name: 'Demo Investor',
  email: 'demo@wealthpulse.test',
  password: 'Password123',
  roles: ['Admin', 'Advisor', 'Viewer']
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly sessionState = signal<AuthSession | null>(this.readSession());
  private readonly loginUrl = `${authConfig.identityApiBaseUrl}${authConfig.endpoints.login}`;
  private readonly registerUrl = `${authConfig.identityApiBaseUrl}${authConfig.endpoints.register}`;
  private readonly refreshUrl = `${authConfig.identityApiBaseUrl}${authConfig.endpoints.refresh}`;
  private logoutTimer: ReturnType<typeof setTimeout> | null = null;

  readonly session = this.sessionState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.sessionState()?.accessToken));

  constructor() {
    this.scheduleSessionExpiry();
  }

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

  refreshAccessToken(): Observable<AuthResponse> {
    const refreshToken = this.sessionState()?.refreshToken;

    if (!refreshToken) {
      return throwError(() => new Error('NO_REFRESH_TOKEN'));
    }

    const request = authConfig.useLocalAuth
      ? of(this.createLocalRefreshResponse())
      : this.http.post<AuthResponse>(this.refreshUrl, { refreshToken });

    return request.pipe(tap((response) => this.saveSession(response)));
  }

  isAuthEndpoint(url: string): boolean {
    return url.includes(this.loginUrl) || url.includes(this.registerUrl) || url.includes(this.refreshUrl);
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
    localStorage.removeItem(USER_ROLES_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
    this.clearLogoutTimer();
  }

  getAccessToken(): string | null {
    return this.sessionState()?.accessToken ?? null;
  }

  hasRole(roles: UserRole[]): boolean {
    const sessionRoles = this.sessionState()?.roles ?? [];
    return roles.length === 0 || roles.some((role) => sessionRoles.includes(role));
  }

  private saveSession(response: AuthResponse): void {
    const userEmail = this.readTokenClaim(response.accessToken, 'email');
    const userName = this.readTokenClaim(response.accessToken, 'name');
    const roles = this.readTokenRoles(response.accessToken);
    const expiresAt = Date.now() + authConfig.sessionTimeoutMinutes * 60 * 1000;
    const session: AuthSession = {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken ?? null,
      userEmail,
      userName,
      roles,
      expiresAt
    };

    this.sessionState.set(session);
    this.scheduleSessionExpiry();

    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    this.setOptionalStorageValue(USER_EMAIL_KEY, session.userEmail);
    this.setOptionalStorageValue(USER_NAME_KEY, session.userName);
    localStorage.setItem(USER_ROLES_KEY, JSON.stringify(session.roles));
    localStorage.setItem(EXPIRES_AT_KEY, String(session.expiresAt));

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
    const expiresAt = Number(localStorage.getItem(EXPIRES_AT_KEY) ?? 0);

    if (!accessToken || !expiresAt || expiresAt <= Date.now()) {
      this.clearStoredSession();
      return null;
    }

    return {
      accessToken,
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
      userEmail: localStorage.getItem(USER_EMAIL_KEY),
      userName: localStorage.getItem(USER_NAME_KEY),
      roles: this.readStoredRoles(),
      expiresAt
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
          password: credentials.password,
          roles: ['Advisor']
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
      return [DEMO_USER];
    }

    try {
      const parsedUsers: unknown = JSON.parse(storedUsers);

      if (!Array.isArray(parsedUsers)) {
        return [];
      }

      const storedLocalUsers = parsedUsers.filter((user) => this.isLocalAuthUser(user)).map((user) => ({
        ...user,
        roles: this.normalizeRoles(user.roles)
      }));

      return storedLocalUsers.some((user) => user.email.toLowerCase() === DEMO_USER.email) ? storedLocalUsers : [DEMO_USER, ...storedLocalUsers];
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
      typeof candidate['password'] === 'string' &&
      (candidate['roles'] === undefined || Array.isArray(candidate['roles']))
    );
  }

  private normalizeRoles(roles: unknown): UserRole[] {
    if (!Array.isArray(roles)) {
      return ['Advisor'];
    }

    const validRoles = roles.filter((role): role is UserRole => role === 'Admin' || role === 'Advisor' || role === 'Viewer');
    return validRoles.length > 0 ? validRoles : ['Advisor'];
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
      roles: user.roles.join(','),
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
    const value = this.readTokenPayload(token)?.[claim];
    return typeof value === 'string' ? value : null;
  }

  private readTokenRoles(token: string): UserRole[] {
    const roles = this.readTokenPayload(token)?.['roles'];
    const values = Array.isArray(roles) ? roles : typeof roles === 'string' ? roles.split(',') : [];

    return values.filter((role): role is UserRole => role === 'Admin' || role === 'Advisor' || role === 'Viewer');
  }

  private readTokenPayload(token: string): Record<string, unknown> | null {
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
      return parsedPayload && typeof parsedPayload === 'object' ? (parsedPayload as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }

  private readStoredRoles(): UserRole[] {
    if (!this.isBrowser) {
      return [];
    }

    try {
      const roles: unknown = JSON.parse(localStorage.getItem(USER_ROLES_KEY) ?? '[]');
      return Array.isArray(roles) ? roles.filter((role): role is UserRole => role === 'Admin' || role === 'Advisor' || role === 'Viewer') : [];
    } catch {
      return [];
    }
  }

  private setOptionalStorageValue(key: string, value: string | null): void {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  }

  private scheduleSessionExpiry(): void {
    this.clearLogoutTimer();

    if (!this.isBrowser) {
      return;
    }

    const expiresAt = this.sessionState()?.expiresAt;

    if (!expiresAt) {
      return;
    }

    const timeout = Math.max(0, expiresAt - Date.now());

    this.logoutTimer = setTimeout(() => {
      this.logout();
      void this.router.navigate(['/login']);
    }, timeout);
  }

  private clearLogoutTimer(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  private clearStoredSession(): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(USER_NAME_KEY);
    localStorage.removeItem(USER_ROLES_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  }

  private createId(): string {
    if (this.isBrowser && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    return `local-${Date.now()}`;
  }

  private createLocalRefreshResponse(): AuthResponse {
    const session = this.sessionState();

    if (!session) {
      throw new Error('NO_SESSION');
    }

    const user: LocalAuthUser = {
      id: 'local-session',
      name: session.userName ?? 'Local User',
      email: session.userEmail ?? 'local@wealthpulse.test',
      password: '',
      roles: session.roles
    };

    return {
      accessToken: this.createLocalJwt(user),
      refreshToken: session.refreshToken ?? `local-refresh-${Date.now()}`
    };
  }
}
