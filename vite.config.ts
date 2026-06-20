/// <reference types="vitest/config" />
import path from "node:path"
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"
import svgLoader from 'vite-svg-loader'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

const port = process.env.VITE_USE_MOCK ? 67700 : 57700

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/exr/option/': `http://127.0.0.1:${port}`,
      '/exr/role/filter/': `http://127.0.0.1:${port}`,
      '/au/option/': `http://127.0.0.1:${port}`,
      '/au/translation/batch/': `http://127.0.0.1:${port}`,
      '/au/translation/batch/optionunit/': `http://127.0.0.1:${port}`,
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
      reporter: ['text', 'html', 'json-summary', 'json'],
      exclude: ['./src/components/ui/**.tsx'],
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
  build: {
    rolldownOptions: {
      output: {
        minify:
          mode === 'production'
            ? {
                compress: {
                  dropConsole: true,
                  dropDebugger: true,
                },
              }
            : undefined,
      },
    },
  },
}))
