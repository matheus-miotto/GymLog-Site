// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Publicação em GitHub Pages: https://matheus-miotto.github.io/GymLog-Site/
export default defineConfig({
  site: 'https://matheus-miotto.github.io',
  base: '/GymLog-Site',
  output: 'static',
  integrations: [
    // Página 404 não é uma rota real de conteúdo — não deve aparecer no sitemap.
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
    }),
  ],
});
