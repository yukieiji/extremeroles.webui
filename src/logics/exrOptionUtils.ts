import { exrOptionMetaData } from "./api";
import { PRESET_OPTION_UNIQUE_ID } from "./optionUtils";
import type { UniqueOptionId } from "../type";

/**
 * 表示対象のカテゴリIDをフィルタリングします。
 * 1. プリセット設定以外のトップレベルオプションが存在すること
 * 2. そのトップレベルオプションのうち、少なくとも1つがアクティブであること
 */
export function filterVisibleCategoryIds(
	categoryIds: number[],
	isExROptionActive: Record<UniqueOptionId, boolean>,
): number[] {
	return categoryIds.filter((categoryId) => {
		const categoryUniqueOptions =
			exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId];
		if (!categoryUniqueOptions) {
			return false;
		}

		const filteredUniqueOptions =
			categoryId === 0
				? categoryUniqueOptions.filter((optionId) => {
						return optionId !== PRESET_OPTION_UNIQUE_ID;
					})
				: categoryUniqueOptions;

		return (
			filteredUniqueOptions.length > 0 &&
			filteredUniqueOptions.some((id) => isExROptionActive[id])
		);
	});
}

/**
 * カテゴリ内の表示対象のトップレベルオプションIDをフィルタリングします。
 * プリセット設定（OptionId 0）を除外します。
 */
export function filterVisibleTopLevelOptionIds(
	categoryId: number,
	uniqueOptionIds: UniqueOptionId[],
): UniqueOptionId[] {
	if (categoryId !== 0) {
		return uniqueOptionIds;
	}
	return uniqueOptionIds.filter((uniqueId) => {
		return uniqueId !== PRESET_OPTION_UNIQUE_ID;
	});
}
