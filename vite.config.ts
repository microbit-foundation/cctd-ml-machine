import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import WindiCSS from 'vite-plugin-windicss'
import {sveltePreprocess} from "svelte-preprocess/dist/autoProcess";

/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [svelte(
        {preprocess: sveltePreprocess({typescript: true})}
    ), WindiCSS()],
    build: {
        rollupOptions: {
            input: "index.html"
        }
    }
})
