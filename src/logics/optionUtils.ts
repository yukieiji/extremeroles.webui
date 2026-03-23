import type { ExROptionDto } from '../type';

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

/**
 * カラータグ（<color=#RRGGBB>...</color>）が含まれているか判定します。
 */
export function hasColorTag(text: string): boolean {
  return /<color=#[0-9A-F]{6,8}>/i.test(text) && /<\/color>/i.test(text);
}

/**
 * オプションがトグルスイッチとして表示されるべきか判定します。
 * 条件:
 * 1. Type が "String" である
 * 2. Values の長さがちょうど 2 である
 * 3. 両方の値にカラータグが含まれている
 */
export function isToggleOption(option: ExROptionDto): boolean {
  const { Type, Values } = option.RangeMeta;

  if (Type !== 'String' || Values.length !== 2) {
    return false;
  }

  return Values.every((value) => {
    return typeof value === 'string' && hasColorTag(value);
  });
}
