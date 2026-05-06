import { CategoryContainer } from "@/components/blocks/CategoryContainer";
import { useVisibleCategories } from "@/hooks/useExROptionData";
import { exrOptionMetaData } from "@/logics/api";
import { ExRTabId } from "@/type";
import { useStore } from "@/useStore";
import { ExRRoleCategoryItem } from "./ExRRoleCategoryItem";
import { ExRStandardCategoryItem } from "./ExRStandardCategoryItem";

/**
 * 選択されたタブのカテゴリ一覧を表示するコンポーネント
 */

interface CategoryListProps {
	categoryIds: number[];
}

function ExRStandardCategoryList({ categoryIds }: CategoryListProps) {
	const visibleCategoryIds = useVisibleCategories(categoryIds);

	return (
		<>
			{visibleCategoryIds.map((categoryId) => (
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
