import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { guestGuard } from './auth/guest.guard';
import { roleGuard } from './auth/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then((m) => m.Register)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'clients',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Advisor'] },
    loadChildren: () => import('./clients/clients.routes').then((m) => m.clientsRoutes)
  },
  {
    path: 'billing',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Advisor'] },
    loadChildren: () => import('./billing/billing.routes').then((m) => m.billingRoutes)
  },
  {
    path: 'market',
    canActivate: [authGuard],
    loadChildren: () => import('./market/market.routes').then((m) => m.marketRoutes)
  },
  {
    path: 'portfolio',
    canActivate: [authGuard],
    loadChildren: () => import('./portfolio/portfolio.routes').then((m) => m.portfolioRoutes)
  },
  {
    path: 'settings',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    loadChildren: () => import('./settings/settings.routes').then((m) => m.settingsRoutes)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
