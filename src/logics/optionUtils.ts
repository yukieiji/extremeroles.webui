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

const MIN_SUFFIXES = [
  ' 最小', '　最小', ' 最少', '　最少', ' Min', ' 最小值',
  ' (Min)', '(Min)', ' [Min]', '[Min]',
  '最小', '最少', 'Min', '最小值'
];
const MAX_SUFFIXES = [
  ' 最大', '　最大', ' Max', ' 最大值',
  ' (Max)', '(Max)', ' [Max]', '[Max]',
  '最大', 'Max', '最大值'
];

/**
 * オプション名が「最小」または「最大」の設定ペアであるか、およびそのタイプを判定します。
 */
export function getOptionPairType(name: string): 'min' | 'max' | 'none' {
  if (MIN_SUFFIXES.some((suffix) => {
    return name.endsWith(suffix);
  })) {
    return 'min';
  }
  if (MAX_SUFFIXES.some((suffix) => {
    return name.endsWith(suffix);
  })) {
    return 'max';
  }
  return 'none';
}

/**
 * 「最小」「最大」を取り除いたベースのオプション名を取得します。
 */
export function getBaseOptionName(name: string): string {
  // 長いサフィックスから順にチェックすることで、誤判定を防ぐ
  const allSuffixes = [...MIN_SUFFIXES, ...MAX_SUFFIXES].sort((a, b) => {
    return b.length - a.length;
  });
  for (const suffix of allSuffixes) {
    if (name.endsWith(suffix)) {
      return name.slice(0, -suffix.length).trim();
    }
  }
  return name;
}

/**
 * RangeMeta.Values が数値配列であるか判定する型ガードです。
 */
export function isNumericRange(values: number[] | string[]): values is number[] {
  return values.length > 0 && typeof values[0] === 'number';
}

/**
 * オプション名からサフィックス（「最小」「最大」など）のみを抽出します。
 */
export function getOptionLabel(name: string): string {
  const allSuffixes = [...MIN_SUFFIXES, ...MAX_SUFFIXES].sort((a, b) => {
    return b.length - a.length;
  });
  for (const suffix of allSuffixes) {
    if (name.endsWith(suffix)) {
      return suffix.trim();
    }
  }
  return '';
}

/**
 * 数値配列の中から、ターゲット値に最も近い値のインデックスを返します。
 */
export function findClosestIndex(values: number[], target: number): number {
  if (values.length === 0) {
    return 0;
  }
  let closestIdx = 0;
  let minDiff = Math.abs(values[0] - target);

  for (let i = 1; i < values.length; i++) {
    const diff = Math.abs(values[i] - target);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = i;
    }
  }
  return closestIdx;
}

/**
 * オプションリストを走査し、連続する最小・最大ペアをまとめます。
 */
export function groupOptionPairs(
  options: ExROptionDto[]
): (
  | ExROptionDto
  | {
      type: 'pair';
      baseName: string;
      min: ExROptionDto;
      max: ExROptionDto;
      minLabel: string;
      maxLabel: string;
    }
)[] {
  const result: (
    | ExROptionDto
    | {
        type: 'pair';
        baseName: string;
        min: ExROptionDto;
        max: ExROptionDto;
        minLabel: string;
        maxLabel: string;
      }
  )[] = [];

  for (let i = 0; i < options.length; i++) {
    const current = options[i];
    const next = options[i + 1];

    if (next) {
      const currentType = getOptionPairType(current.TranslatedName);
      const nextType = getOptionPairType(next.TranslatedName);

      if (currentType === 'min' && nextType === 'max') {
        const currentBase = getBaseOptionName(current.TranslatedName);
        const nextBase = getBaseOptionName(next.TranslatedName);

        if (currentBase === nextBase) {
          result.push({
            type: 'pair',
            baseName: currentBase,
            min: current,
            max: next,
            minLabel: getOptionLabel(current.TranslatedName),
            maxLabel: getOptionLabel(next.TranslatedName),
          });
          i++; // 次の要素をスキップ
          continue;
        }
      }
    }

    result.push(current);
  }

  return result;
}
