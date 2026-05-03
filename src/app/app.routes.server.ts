import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'clients/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'clients/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: 'billing/invoices/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'portfolio/client/:clientId',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
