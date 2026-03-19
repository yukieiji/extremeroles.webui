# MSW v2 Setup in Vite Project

## Setup Steps
1. Install MSW: `pnpm add msw -D`
2. Initialize MSW: `pnpm exec msw init public/ --save`
3. Create handlers in `mocks/handlers.ts`:
   ```typescript
   import { http, HttpResponse } from 'msw';
   export const handlers = [
     http.get('/api/endpoint', () => HttpResponse.json({ data: 'mocked' }))
   ];
   ```
4. Create worker in `mocks/browser.ts`:
   ```typescript
   import { setupWorker } from 'msw/browser';
   import { handlers } from './handlers';
   export const worker = setupWorker(...handlers);
   ```
5. Integrate in `src/main.tsx`:
   ```typescript
   async function enableMocking() {
     if (!import.meta.env.DEV) return;
     const { worker } = await import('../mocks/browser');
     return worker.start();
   }
   enableMocking().then(() => {
     // render app
   });
   ```

## Note
- In Vite, use `import.meta.env.DEV` instead of `process.env.NODE_ENV`.
- Use `HttpResponse` instead of `res()` from MSW v1.
