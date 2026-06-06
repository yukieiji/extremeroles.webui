import { OptionEditorAccordion } from "@/components/blocks/OptionEditorAccordion";
import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { createAuCategoryNavigateId } from "@/hooks/useOptionNavigation";
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
	const highlightedAuCategoryId = useStore(
		(state) => state.highlightedAuCategoryId,
	);
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	if (!categoryMeta) {
		return null;
	}

	const isHighlighted = highlightedAuCategoryId === categoryId;
	const navigateId = createAuCategoryNavigateId(categoryId);

	return (
		<HighlightWrapper
			id={navigateId}
			isHighlighted={isHighlighted}
			isInset={false}
		>
			<OptionEditorAccordion
				title={categoryMeta.name}
				isOpen={isOpen}
				onToggle={() => toggleAuCategory(categoryId)}
			>
				<AuCategoryOptionList optionIds={categoryMeta.options} />
			</OptionEditorAccordion>
		</HighlightWrapper>
	);
}
