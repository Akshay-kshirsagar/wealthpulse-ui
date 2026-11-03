import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'clients/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'clients/:id/edit',
    renderMode: RenderMode.Client
  },
  {
    path: 'billing/invoices/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'portfolio/client/:clientId',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
