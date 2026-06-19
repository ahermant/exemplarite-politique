import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: 'https://ahermant.github.io',
  // base: '/exemplarite-politique', // Décommenter pour GitHub Pages
});
