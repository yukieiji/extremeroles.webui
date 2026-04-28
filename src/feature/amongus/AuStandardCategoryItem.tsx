import { OptionEditorAccordion } from "../../components/blocks/OptionEditorAccordion";
import { HighlightWrapper } from "../../components/parts/HighlightWrapper";
import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";
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
	const highlightedAuOptionId = useStore(
		(state) => state.highlightedAuOptionId,
	);

	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	if (!categoryMeta) {
		return null;
	}

	const isHighlighted =
		highlightedAuOptionId !== null &&
		categoryMeta.options.includes(highlightedAuOptionId);

	return (
		<HighlightWrapper
			isHighlighted={isHighlighted}
			data-testid={`au-category-${categoryId}`}
			className="mb-2"
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
