import { Routes } from '@angular/router';

export const marketRoutes: Routes = [
  { path: '', redirectTo: 'watch', pathMatch: 'full' },
  { path: 'watch', loadComponent: () => import('./market-watch/market-watch').then((m) => m.MarketWatch) },
  { path: 'holdings', loadComponent: () => import('./holdings/holdings').then((m) => m.Holdings) },
  { path: 'orders', loadComponent: () => import('./orders/orders').then((m) => m.Orders) },
  { path: 'positions', loadComponent: () => import('./positions/positions').then((m) => m.Positions) }
];
