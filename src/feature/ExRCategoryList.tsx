import { use } from "react";
import { getExrTabOptions } from "../logics/api";
import { isPresetOption } from "../logics/optionUtils";
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
	const exrOptionsVersion = useStore((state) => {
		return state.exrOptionsVersion;
	});

	// タブごとのデータを取得。exrOptionsVersionが更新されると再レンダリングされ、最新のプロミスがuse()される
	const selectedTab = use(getExrTabOptions(selectedExRTabId));

	const isRoleTab = selectedExRTabId !== OptionTab.GeneralTab;

	// オプションが空でない、かつ少なくとも1つのオプションが有効なカテゴリのみを抽出
	// ※ プリセット設定が唯一のオプションだった場合も考慮してフィルタリング
	const visibleCategories = selectedTab.Categories.filter((category) => {
		const filteredOptions = category.Options.filter((option) => {
			const isPreset = isPresetOption(category.Id, option.Id);
			return !isPreset;
		});
		return filteredOptions.some((opt) => {
			return opt.IsActive;
		});
	});

	return (
		<div
			key={`${selectedExRTabId}-${exrOptionsVersion}`}
			data-testid="exr-category-list"
			className={`flex flex-col relative transition-opacity duration-200 ${isTabPending ? "is-pending opacity-50 pointer-events-none" : "opacity-100"}`}
			data-is-pending={isTabPending ? "true" : "false"}
		>
			{isTabPending && (
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}
			{visibleCategories.map((category) => {
				if (isRoleTab) {
					return (
						<ExRRoleCategoryItem
							key={`${selectedExRTabId}-${category.Id}`}
							category={category}
						/>
					);
				}
				return (
					<ExRStandardCategoryItem
						key={`${selectedExRTabId}-${category.Id}`}
						category={category}
					/>
				);
			})}
		</div>
	);
}
