import { RightPanelContainer } from "@/components/blocks/RightPanelContainer";
import { ViewerGroupAccordion } from "@/components/blocks/ViewerGroupAccordion";
import { auOptionMetaData } from "@/logics/api";
import { getAuOptionId } from "@/logics/optionUtils";
import { OptionValueType } from "@/type";
import { useStore } from "@/useStore";
import { AuTab0OptionRow } from "./AuTab0OptionRow";

interface AuTab0GeneralCategoryProps {
	categoryId: number;
}

/**
 * 一般カテゴリコンポーネント
 */
export function AuTab0GeneralCategory({
	categoryId,
}: AuTab0GeneralCategoryProps) {
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	const isOpen = useStore(
		(state) => state.openedAuTab0CategoryIds[categoryId] ?? true,
	);
	const toggleAuTab0Category = useStore((state) => {
		return state.toggleAuTab0Category;
	});

	if (!categoryMeta) {
		return null;
	}

	const impCountOptionId = getAuOptionId(1, OptionValueType.Int);
	const filteredOptions = categoryMeta.options.filter(id => id !== impCountOptionId);

	if (filteredOptions.length === 0) {
		return null;
	}

	return (
		<ViewerGroupAccordion
			title={<span className="text-base">{categoryMeta.name}</span>}
			isOpen={isOpen}
			onToggle={() => {
				toggleAuTab0Category(categoryId);
			}}
		>
			<RightPanelContainer arr={filteredOptions} ignoreIndex={0}>
				{(optionId) => (
					<AuTab0OptionRow optionId={optionId} categoryId={categoryId} />
				)}
			</RightPanelContainer>
		</ViewerGroupAccordion>
	);
}
