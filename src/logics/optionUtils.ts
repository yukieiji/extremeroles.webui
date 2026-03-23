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

import type { ExROptionDto } from '../type';

export type MinMaxType = 'min' | 'max';

const MIN_PATTERNS = [
  /[ 　]最小$/,
  /[ 　]最少$/,
  /[ 　]最小值$/,
  /[ 　]最小値$/,
  /[ 　]Min$/,
  /[ 　]Minimum$/,
];
const MAX_PATTERNS = [
  /[ 　]最大$/,
  /[ 　]最多$/,
  /[ 　]最大值$/,
  /[ 　]最大値$/,
  /[ 　]Max$/,
  /[ 　]Maximum$/,
];

/**
 * オプション名から接尾辞（最小/最大など）を除去したベース名と種類、および除去された接尾辞を取得します。
 */
export function getBaseNameAndType(
  name: string
): { baseName: string; type: MinMaxType; suffix: string } | null {
  for (const pattern of MIN_PATTERNS) {
    const match = name.match(pattern);
    if (match) {
      return {
        baseName: name.replace(pattern, '').trim(),
        type: 'min',
        suffix: match[0].trim(),
      };
    }
  }
  for (const pattern of MAX_PATTERNS) {
    const match = name.match(pattern);
    if (match) {
      return {
        baseName: name.replace(pattern, '').trim(),
        type: 'max',
        suffix: match[0].trim(),
      };
    }
  }
  return null;
}

export type OptionGroup =
  | {
      type: 'single';
      option: ExROptionDto;
    }
  | {
      type: 'min-max';
      baseName: string;
      minOption: ExROptionDto;
      minSuffix: string;
      maxOption: ExROptionDto;
      maxSuffix: string;
    };

/**
 * オプションのリストを走査し、連続する「最小」と「最大」のペアをグループ化します。
 */
export function groupOptions(options: ExROptionDto[]): OptionGroup[] {
  const groups: OptionGroup[] = [];
  for (let i = 0; i < options.length; i++) {
    const current = options[i];
    const next = options[i + 1];

    if (next && current.IsActive && next.IsActive) {
      const currentInfo = getBaseNameAndType(current.TranslatedName);
      const nextInfo = getBaseNameAndType(next.TranslatedName);

      if (currentInfo && nextInfo && currentInfo.baseName === nextInfo.baseName) {
        if (currentInfo.type === 'min' && nextInfo.type === 'max') {
          groups.push({
            type: 'min-max',
            baseName: currentInfo.baseName,
            minOption: current,
            minSuffix: currentInfo.suffix,
            maxOption: next,
            maxSuffix: nextInfo.suffix,
          });
          i++; // 次の要素をスキップ
          continue;
        }
      }
    }

    groups.push({
      type: 'single',
      option: current,
    });
  }
  return groups;
}
