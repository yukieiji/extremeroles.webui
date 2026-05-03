import { RightPanelContainer } from "../../components/blocks/RightPanelContainer";
import { VieweGroupAccordion } from "../../components/blocks/VieweGroupAccordion";
import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";
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

	return (
		<VieweGroupAccordion
			title={<span className="text-base">{categoryMeta.name}</span>}
			isOpen={isOpen}
			onToggle={() => {
				toggleAuTab0Category(categoryId);
			}}
		>
			<RightPanelContainer arr={categoryMeta.options}>
				{(optionId) => (
					<AuTab0OptionRow optionId={optionId} categoryId={categoryId} />
				)}
			</RightPanelContainer>
		</VieweGroupAccordion>
	);
}
