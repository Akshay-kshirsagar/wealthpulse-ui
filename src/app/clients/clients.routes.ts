import { Routes } from '@angular/router';

export const clientsRoutes: Routes = [
  { path: '', loadComponent: () => import('./clients-list/clients-list').then((m) => m.ClientsList) },
  { path: 'add', loadComponent: () => import('./add-client/add-client').then((m) => m.AddClient) },
  { path: ':id/edit', loadComponent: () => import('./edit-client/edit-client').then((m) => m.EditClient) },
  { path: ':id', loadComponent: () => import('./client-details/client-details').then((m) => m.ClientDetails) }
];
