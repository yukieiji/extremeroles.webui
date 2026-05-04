/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"
import svgLoader from 'vite-svg-loader'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

const port = process.env.VITE_USE_MOCK ? 67700 : 57700

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/exr/option/': `http://localhost:${port}`,
      '/exr/role/filter/': `http://localhost:${port}`,
      '/au/option/': `http://localhost:${port}`,
      '/au/translation/batch/': `http://localhost:${port}`,
      '/au/translation/batch/optionunit/': `http://localhost:${port}`,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['./tests/**'],
    exclude: ['./tests/setup.ts'],
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      thresholds: {
        lines: 85,
        functions: 80,
        statements: 80,
        branches: 60
      },
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    svgLoader(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
