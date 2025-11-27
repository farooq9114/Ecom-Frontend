import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Prerender only static pages
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender
  },

  // ❌ Disable prerendering for dynamic pages
  {
    path: 'perfume/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'combos/:id',
    renderMode: RenderMode.Server
  },

  // fallback
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
