import { useShallow } from "zustand/react/shallow";
import { exrOptionMetaData } from "../logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "../logics/optionUtils";
import type { ExROptionValueData, UniqueOptionId } from "../type";
import { useStore } from "../useStore";

export function useOptionData(
	uniqueOptionId: UniqueOptionId,
): ExROptionValueData {
	return useStore(useShallow((state) => state.exrValue[uniqueOptionId]));
}

export function useVisibleCategories(checkCategoryIds: number[]) {
	return useStore(
		useShallow((state) =>
			checkCategoryIds
				? checkCategoryIds.filter((categoryId) => {
						const categoryUniqueOptions =
							exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId];
						if (!categoryUniqueOptions) {
							return false;
						}

						const filterdUniqueOptions =
							categoryId === 0
								? categoryUniqueOptions.filter((optionId) => {
										return optionId !== PRESET_OPTION_UNIQUE_ID; // プリセット設定（OptionId 0）を除外
									})
								: categoryUniqueOptions;
						return (
							filterdUniqueOptions.length > 0 &&
							filterdUniqueOptions.some((id) => state.isExROptionActive[id])
						);
					})
				: [],
		),
	);
}
