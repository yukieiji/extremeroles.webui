import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * 開発環境の場合にMSWを有効化
 */
async function enableMocking() {
  if (!import.meta.env.DEV) {
    return
  }

  const { worker } = await import('../mocks/browser')

  // MSWをサービスワーカーとして登録
  return worker.start()
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
