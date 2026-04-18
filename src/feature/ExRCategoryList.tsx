import { exrOptionMetaData } from "../logics/api";
import { getUniqueOptionId, isPresetOption } from "../logics/optionUtils";
import { OptionTab } from "../type";
import { useStore } from "../useStore";
import { ExRRoleCategoryItem } from "./ExRRoleCategoryItem";
import { ExRStandardCategoryItem } from "./ExRStandardCategoryItem";

/**
 * 選択されたタブのカテゴリ一覧を表示するコンポーネント
 */
export function ExRCategoryList() {
	const selectedExRTabId = useStore((state) => {
		return state.selectedExRTabId;
	});
	const isTabPending = useStore((state) => {
		return state.isTabPending;
	});
	const isOptionActive = useStore((state) => {
		return state.isOptionActive;
	});

	const categoryIds = exrOptionMetaData.categoryIdMap[selectedExRTabId] ?? [];

	const isRoleTab = selectedExRTabId !== OptionTab.GeneralTab;

	// オプションが空でない、かつ少なくとも1つのオプションが有効なカテゴリのみを抽出
	// ※ プリセット設定が唯一のオプションだった場合も考慮してフィルタリング
	const visibleCategoryIds = categoryIds.filter((categoryId) => {
		const optionIds = exrOptionMetaData.optionIdMap[categoryId] ?? [];
		const filteredOptionIds = optionIds.filter((optionId) => {
			const isPreset = isPresetOption(categoryId, optionId);
			return !isPreset;
		});
		return filteredOptionIds.some((optionId) => {
			const uniqueId = getUniqueOptionId(
				selectedExRTabId,
				categoryId,
				optionId,
			);
			return isOptionActive[uniqueId];
		});
	});

	return (
		<div
			data-testid="exr-category-list"
			className={`flex flex-col relative transition-opacity duration-200 ${isTabPending ? "is-pending opacity-50 pointer-events-none" : "opacity-100"}`}
			data-is-pending={isTabPending ? "true" : "false"}
		>
			{isTabPending && (
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}
			{visibleCategoryIds.map((categoryId) => {
				if (isRoleTab) {
					return (
						<ExRRoleCategoryItem
							key={`${selectedExRTabId}-${categoryId}`}
							categoryId={categoryId}
						/>
					);
				}
				return (
					<ExRStandardCategoryItem
						key={`${selectedExRTabId}-${categoryId}`}
						categoryId={categoryId}
					/>
				);
			})}
		</div>
	);
}
