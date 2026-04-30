import { CategoryContainer } from "../../components/blocks/CategoryContainer";
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
		<CategoryContainer isPending={isTabPending}>
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
		</CategoryContainer>
	);
}
