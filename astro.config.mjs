// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://notasianrizz.github.io',
  base: '/zandi.vip',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});