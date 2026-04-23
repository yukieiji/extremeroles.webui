/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"
import svgLoader from 'vite-svg-loader'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/exr/option/': 'http://localhost:57700',
      '/au/option/': 'http://localhost:57700',
      '/au/translation/batch/': 'http://localhost:57700',
      '/au/translation/batch/optionunit/': 'http://localhost:57700',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    exclude: ['**/e2e/**', '**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**'],
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    svgLoader(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
