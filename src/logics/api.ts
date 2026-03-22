import type { ExRTabDto, AuOptionCategoryDto } from '../type';

/**
 * API エンドポイントの定数定義
 */
const EXR_OPTION_URL = '/exr/option/';
const AU_OPTION_URL = '/au/option/';

/**
 * APIからデータを取得するPromiseをキャッシュするためのグローバル変数
 * React 19 の use() で扱うためにリクエストを一度だけ実行するようにします
 */
let exrOptionsPromise: Promise<ExRTabDto[]> | null = null;
let auOptionsPromise: Promise<AuOptionCategoryDto[]> | null = null;

/**
 * キャッシュをリセットする（テスト用）
 */
export function resetApiCache() {
  exrOptionsPromise = null;
  auOptionsPromise = null;
}

/**
 * ExRオプションを取得する
 */
export function getExrOptions(): Promise<ExRTabDto[]> {
  if (exrOptionsPromise) {
    return exrOptionsPromise;
  }

  // @ts-expect-error - テスト用
  const delay = typeof window !== 'undefined' ? window.__API_DELAY__ || 0 : 0;

  exrOptionsPromise = (async () => {
    if (delay > 0) {
      await new Promise((resolve) => {
        return setTimeout(resolve, delay);
      });
    }
    const res = await fetch(EXR_OPTION_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch ExR options: ${res.statusText}`);
    }
    return res.json();
  })();

  return exrOptionsPromise;
}

/**
 * Auオプションを取得する
 */
export function getAuOptions(): Promise<AuOptionCategoryDto[]> {
  if (auOptionsPromise) {
    return auOptionsPromise;
  }

  // @ts-expect-error - テスト用
  const delay = typeof window !== 'undefined' ? window.__API_DELAY__ || 0 : 0;

  auOptionsPromise = (async () => {
    if (delay > 0) {
      await new Promise((resolve) => {
        return setTimeout(resolve, delay);
      });
    }
    const res = await fetch(AU_OPTION_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch Au options: ${res.statusText}`);
    }
    return res.json();
  })();

  return auOptionsPromise;
}

/**
 * 両方のオプションをまとめて取得する
 */
export function getAllOptions(): Promise<[ExRTabDto[], AuOptionCategoryDto[]]> {
  return Promise.all([getExrOptions(), getAuOptions()]);
}
