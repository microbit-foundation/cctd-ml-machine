import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import WindiCSS from 'vite-plugin-windicss';
import { sveltePreprocess } from 'svelte-preprocess/dist/autoProcess';
import EnvironmentPlugin from 'vite-plugin-environment';

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ typescript: true }),

      onwarn(warning, defaultHandler) {
        /*if (warning.code.includes('a11y')) return;  <- This disabled A11y warnings  */

        // handle all other warnings normally
        defaultHandler!(warning);
      },
    }),
    WindiCSS(),
    EnvironmentPlugin('all'),
  ],
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
});
