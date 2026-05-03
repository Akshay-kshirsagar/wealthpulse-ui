import { Routes } from '@angular/router';

export const portfolioRoutes: Routes = [
  { path: '', redirectTo: 'summary', pathMatch: 'full' },
  { path: 'summary', loadComponent: () => import('./portfolio-summary/portfolio-summary').then((m) => m.PortfolioSummaryPage) },
  { path: 'asset-allocation', loadComponent: () => import('./asset-allocation/asset-allocation').then((m) => m.AssetAllocationPage) },
  { path: 'client/:clientId', loadComponent: () => import('./client-portfolio/client-portfolio').then((m) => m.ClientPortfolioPage) }
];
