/**
 * カテゴリIDとオプションIDを組み合わせて、アプリケーション内で一意なIDを生成します。
 */
export function getUniqueOptionId(categoryId: number, optionId: number): string {
  return `${categoryId}-${optionId}`;
}
