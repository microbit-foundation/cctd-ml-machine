/// <reference types="vitest" />
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { defineConfig, loadEnv } from 'vite';
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const commonEnv = loadEnv(mode, process.cwd(), '');

  return {
    base: process.env.BASE_URL ?? '/',
    plugins: [
      react()
    ],
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version),
    },
    build: {
      target: 'es2017',
      rollupOptions: {
        input: 'index.html',
      },
    },
    server: commonEnv.API_PROXY
      ? {
          port: 5173,
          proxy: {
            '/api/v1': {
              target: commonEnv.API_PROXY,
              changeOrigin: true,
            },
          },
        }
      : undefined,
    test: {
      globals: true,
      poolOptions: {
        threads: {
          // threads disabled for now due to https://github.com/vitest-dev/vitest/issues/1982
          singleThread: true,
        },
      },
    },
  };
});