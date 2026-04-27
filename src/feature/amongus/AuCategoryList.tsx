import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";
import { AuRoleCategoryItem } from "./AuRoleCategoryItem";
import { AuStandardCategoryItem } from "./AuStandardCategoryItem";
import { MapDropDown } from "./MapDropDown";

/**
 * Auの選択されたタブのカテゴリ一覧を表示するコンポーネント
 */
export function AuCategoryList() {
	const selectedAuTabId = useStore((state) => state.selectedAuTabId);
	const isTabPending = useStore((state) => state.isAuTabPending);

	const tabCategoryIds = auOptionMetaData.tabCategoryMap[selectedAuTabId] || [];
	const isRoleTab = selectedAuTabId === 1 || selectedAuTabId === 2;

	return (
		<div
			data-testid="au-category-list"
			className={`flex flex-col relative transition-opacity duration-200 ${isTabPending ? "is-pending opacity-50 pointer-events-none" : "opacity-100"}`}
		>
			{isTabPending && (
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			)}
			{tabCategoryIds.map((categoryId, index) => {
				if (isRoleTab) {
					return (
						<AuRoleCategoryItem key={categoryId} categoryId={categoryId} />
					);
				}
				if (selectedAuTabId === 0 && index === 0) {
					return <MapDropDown key={categoryId} categoryId={categoryId} />;
				}
				return (
					<AuStandardCategoryItem key={categoryId} categoryId={categoryId} />
				);
			})}
		</div>
	);
}
