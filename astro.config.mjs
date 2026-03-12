// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://bryanzandi.github.io',
  base: '/bryan-zandi-portfolio',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});