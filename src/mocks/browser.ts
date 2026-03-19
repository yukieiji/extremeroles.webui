import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSWワーカーの設定
 */
export const worker = setupWorker(...handlers);
