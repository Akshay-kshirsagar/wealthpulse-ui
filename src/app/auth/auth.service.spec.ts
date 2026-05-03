import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([])]
    });
  });

  it('logs in with the seeded demo user', async () => {
    const service = TestBed.inject(AuthService);

    await firstValueFrom(
      service.login({
        email: 'demo@wealthpulse.test',
        password: 'Password123'
      })
    );

    expect(service.isAuthenticated()).toBe(true);
    expect(service.hasRole(['Admin'])).toBe(true);
    expect(service.getAccessToken()).toContain('.');
  });

  it('clears expired stored sessions on startup', () => {
    localStorage.setItem('wealthpulse.accessToken', 'expired.token.local');
    localStorage.setItem('wealthpulse.expiresAt', String(Date.now() - 1000));

    const service = TestBed.inject(AuthService);

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('wealthpulse.accessToken')).toBeNull();
  });

  it('keeps demo login available after local users are stored', async () => {
    localStorage.setItem(
      'wealthpulse.localUsers',
      JSON.stringify([
        {
          id: 'stored-user',
          name: 'Stored User',
          email: 'stored@wealthpulse.test',
          password: 'Password123',
          roles: ['Advisor']
        }
      ])
    );
    const service = TestBed.inject(AuthService);

    await firstValueFrom(
      service.login({
        email: 'demo@wealthpulse.test',
        password: 'Password123'
      })
    );

    expect(service.isAuthenticated()).toBe(true);
    expect(service.hasRole(['Admin'])).toBe(true);
  });

  it('registers a local advisor and creates a session', async () => {
    const service = TestBed.inject(AuthService);

    await firstValueFrom(
      service.register({
        name: 'New Advisor',
        email: 'advisor@wealthpulse.test',
        password: 'Password123'
      })
    );

    expect(service.isAuthenticated()).toBe(true);
    expect(service.hasRole(['Advisor'])).toBe(true);
  });
});
