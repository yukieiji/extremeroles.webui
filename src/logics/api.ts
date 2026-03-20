import type { ExRTabDto, AuOptionCategoryDto } from '../type';

/**
 * APIからデータを取得するPromiseをキャッシュするためのグローバル変数
 * React 19 の use() で扱うためにリクエストを一度だけ実行するようにします
 */
let exrOptionsPromise: Promise<ExRTabDto[]> | null = null;
let auOptionsPromise: Promise<AuOptionCategoryDto[]> | null = null;

/**
 * ExRオプションを取得する
 */
export function getExrOptions(): Promise<ExRTabDto[]> {
  if (exrOptionsPromise) {
    return exrOptionsPromise;
  }

  exrOptionsPromise = fetch('/exr/option/').then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch ExR options');
    }
    return res.json();
  });

  return exrOptionsPromise;
}

/**
 * Auオプションを取得する
 */
export function getAuOptions(): Promise<AuOptionCategoryDto[]> {
  if (auOptionsPromise) {
    return auOptionsPromise;
  }

  auOptionsPromise = fetch('/au/option/').then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch Au options');
    }
    return res.json();
  });

  return auOptionsPromise;
}

/**
 * 両方のオプションをまとめて取得する
 */
export function getAllOptions(): Promise<[ExRTabDto[], AuOptionCategoryDto[]]> {
  return Promise.all([getExrOptions(), getAuOptions()]);
}
