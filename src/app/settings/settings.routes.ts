import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', loadComponent: () => import('./profile/profile').then((m) => m.Profile) },
  { path: 'change-password', loadComponent: () => import('./change-password/change-password').then((m) => m.ChangePassword) },
  { path: 'system-settings', loadComponent: () => import('./system-settings/system-settings').then((m) => m.SystemSettings) },
  { path: 'users-roles', loadComponent: () => import('./users-roles/users-roles').then((m) => m.UsersRoles) }
];
