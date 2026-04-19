import type { OptionData, UniqueOptionId } from "../type";
import { exrOptionMetaData } from "./constants";

const TAB_ID_MULTIPLIER = 1_000_000_000_000;
const CATEGORY_ID_MULTIPLIER = 1_000_000;

/**
 * タブID、カテゴリID、オプションIDを組み合わせて、アプリケーション内で一意な数値IDを生成します。
 * 13桁目以降：タブID、7～13桁目：カテゴリーID、1～6桁目：オプションID
 */
export function getUniqueOptionId(
	tabId: number,
	categoryId: number,
	optionId: number,
): UniqueOptionId {
	const uniqueId =
		tabId * TAB_ID_MULTIPLIER + categoryId * CATEGORY_ID_MULTIPLIER + optionId;
	return uniqueId as UniqueOptionId;
}

export function parseUniqueOptionId(uniqueOptionId: UniqueOptionId): {
	tabId: number;
	categoryId: number;
	optionId: number;
} {
	const tabId = Math.floor(uniqueOptionId / TAB_ID_MULTIPLIER);
	const categoryId = Math.floor(
		(uniqueOptionId % TAB_ID_MULTIPLIER) / CATEGORY_ID_MULTIPLIER,
	);
	const optionId = uniqueOptionId % CATEGORY_ID_MULTIPLIER;
	return { tabId, categoryId, optionId };
}

/**
 * 指定されたカテゴリIDとオプションIDがプリセット設定（Category 0, Option 0）であるか判定します。
 */
export function isPresetOption(categoryId: number, optionId: number): boolean {
	return categoryId === 0 && optionId === 0;
}

export const PRESET_OPTION_UNIQUE_ID = getUniqueOptionId(0, 0, 0);

const MIN_SUFFIXES = [
	" 最小",
	"　最小",
	" 最少",
	"　最少",
	" Min",
	" 最小值",
	" (Min)",
	"(Min)",
	" [Min]",
	"[Min]",
	"最小",
	"最少",
	"Min",
	"最小值",
];
const MAX_SUFFIXES = [
	" 最大",
	"　最大",
	" Max",
	" 最大值",
	" (Max)",
	"(Max)",
	" [Max]",
	"[Max]",
	"最大",
	"Max",
	"最大值",
];

/**
 * オプション名が「最小」または「最大」の設定ペアであるか、およびそのタイプを判定します。
 */
export function getOptionPairType(name: string): "min" | "max" | "none" {
	if (
		MIN_SUFFIXES.some((suffix) => {
			return name.endsWith(suffix);
		})
	) {
		return "min";
	}
	if (
		MAX_SUFFIXES.some((suffix) => {
			return name.endsWith(suffix);
		})
	) {
		return "max";
	}
	return "none";
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
	return "";
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

interface MinMaxOptionPair {
	type: "pair";
	baseName: string;
	minData: OptionData;
	maxData: OptionData;
}

/**
 * オプションリストを走査し、連続する最小・最大ペアをまとめます。
 */
export function groupOptionPairs(
	uniqueOptionIds: UniqueOptionId[],
): (UniqueOptionId | MinMaxOptionPair)[] {
	const result: (UniqueOptionId | MinMaxOptionPair)[] = [];

	for (let i = 0; i < uniqueOptionIds.length; i++) {
		const currentUniqueId = uniqueOptionIds[i];
		const currentMeta = exrOptionMetaData.optionMetaData[currentUniqueId];
		if (!currentMeta) {
			continue;
		}

		const nextUniqueId = uniqueOptionIds[i + 1];
		if (!nextUniqueId) {
			result.push(currentUniqueId);
			continue;
		}

		const nextMeta = exrOptionMetaData.optionMetaData[nextUniqueId];
		if (!currentMeta || !nextMeta) {
			result.push(currentUniqueId);
			continue;
		}

		const currentType = getOptionPairType(currentMeta.translatedName);
		const nextType = getOptionPairType(nextMeta.translatedName);

		if (currentType === "min" && nextType === "max") {
			const currentBase = getBaseOptionName(currentMeta.translatedName);
			const nextBase = getBaseOptionName(nextMeta.translatedName);

			if (currentBase !== nextBase) {
				result.push(currentUniqueId);
				continue;
			}
			result.push({
				type: "pair",
				baseName: currentBase,
				minData: {
					uniqueOptionId: currentUniqueId,
					metaData: currentMeta,
					label: getOptionLabel(currentMeta.translatedName),
				},
				maxData: {
					uniqueOptionId: nextUniqueId,
					metaData: nextMeta,
					label: getOptionLabel(nextMeta.translatedName),
				},
			});
			i++; // 次の要素をスキップ
		}
	}
	return result;
}
