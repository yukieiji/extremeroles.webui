/**
 * カテゴリIDとオプションIDを組み合わせて、アプリケーション内で一意なIDを生成します。
 */
export function getUniqueOptionId(categoryId: number, optionId: number): string {
  return `${categoryId}-${optionId}`;
}

/**
 * 指定されたカテゴリIDとオプションIDがプリセット設定（Category 0, Option 0）であるか判定します。
 */
export function isPresetOption(categoryId: number, optionId: number): boolean {
  return categoryId === 0 && optionId === 0;
}
