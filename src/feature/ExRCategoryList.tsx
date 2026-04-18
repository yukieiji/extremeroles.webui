import { useShallow } from "zustand/react/shallow";
import { exrOptionMetaData } from "../logics/api";
import { OptionTab } from "../type";
import { useStore } from "../useStore";
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
				const categoryOptions =
					exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId];
				if (!categoryOptions) {
					return false;
				}

				const filterdOptions =
					categoryId === 0
						? categoryOptions.filter((optionId) => {
								return optionId !== 0; // プリセット設定（OptionId 0）を除外
							})
						: categoryOptions;
				return (
					filterdOptions.length > 0 &&
					filterdOptions.some((id) => state.isOptionActive[id])
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
		return state.isTabPending;
	});

	const tabCategory = exrOptionMetaData.tabIdMap[selectedExRTabId];
	const isRoleTab = selectedExRTabId !== OptionTab.GeneralTab;

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
			{isRoleTab ? (
				<ExRRoleCategoryList categoryIds={tabCategory || []} />
			) : (
				<ExRStandardCategoryList categoryIds={tabCategory || []} />
			)}
		</div>
	);
}
