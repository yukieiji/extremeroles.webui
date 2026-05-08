import { OptionEditorAccordion } from "@/components/blocks/OptionEditorAccordion";
import { auOptionMetaData } from "@/logics/api";
import { useStore } from "@/useStore";
import { AuCategoryOptionList } from "./AuCategoryOptionList";

interface AuStandardCategoryItemProps {
	categoryId: number;
}

/**
 * Auの一般タブ（Tab 0）で使用される標準的なカテゴリ表示コンポーネント
 */
export function AuStandardCategoryItem({
	categoryId,
}: AuStandardCategoryItemProps) {
	const isOpen = useStore(
		(state) => state.openedAuCategoryIds[categoryId] ?? false,
	);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	if (!categoryMeta) {
		return null;
	}

	return (
		<div id={`au-category-${categoryId}`}>
			<OptionEditorAccordion
				title={categoryMeta.name}
				isOpen={isOpen}
				onToggle={() => toggleAuCategory(categoryId)}
			>
				<AuCategoryOptionList optionIds={categoryMeta.options} />
			</OptionEditorAccordion>
		</div>
	);
}
