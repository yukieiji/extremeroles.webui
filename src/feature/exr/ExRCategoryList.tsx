import { useShallow } from "zustand/react/shallow";
import { CategoryContainer } from "../../components/blocks/CategoryContainer";
import { exrOptionMetaData } from "../../logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "../../logics/optionUtils";
import { ExRTabId } from "../../type";
import { useStore } from "../../useStore";
import { ExRRoleCategoryItem } from "./ExRRoleCategoryItem";
import { ExRStandardCategoryItem } from "./ExRStandardCategoryItem";

/**
 * 選択されたタブのカテゴリ一覧を表示するコンポーネント
 */

interface CategoryListProps {
	categoryIds: number[];
}

function ExRStandardCategoryList({ categoryIds }: CategoryListProps) {
	const visibleCategories = useStore(
		useShallow((state) => {
			if (!categoryIds) {
				return [];
			}
			return categoryIds.filter((categoryId) => {
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
			});
		}),
	);

	return (
		<>
			{visibleCategories.map((categoryId) => (
				<ExRStandardCategoryItem key={categoryId} categoryId={categoryId} />
			))}
		</>
	);
}

function ExRRoleCategoryList({ categoryIds }: CategoryListProps) {
	return (
		<>
			{categoryIds.map((categoryId) => (
				<ExRRoleCategoryItem key={categoryId} categoryId={categoryId} />
			))}
		</>
	);
}

export function ExRCategoryList() {
	const selectedExRTabId = useStore((state) => {
		return state.selectedExRTabId;
	});
	const isTabPending = useStore((state) => {
		return state.isExRTabPending;
	});

	const tabCategory =
		exrOptionMetaData.tabs[selectedExRTabId]?.categoryIds || [];
	const isRoleTab = selectedExRTabId !== ExRTabId.GeneralTab;

	return (
		<CategoryContainer isPending={isTabPending}>
			{isRoleTab ? (
				<ExRRoleCategoryList categoryIds={tabCategory} />
			) : (
				<ExRStandardCategoryList categoryIds={tabCategory} />
			)}
		</CategoryContainer>
	);
}
