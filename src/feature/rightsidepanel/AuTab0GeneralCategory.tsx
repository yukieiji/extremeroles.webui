import { RightPanelContainer } from "@/components/blocks/RightPanelContainer";
import { ViewerGroupAccordion } from "@/components/blocks/ViewerGroupAccordion";
import { TYPOGRAPHY } from "@/designConstants";
import { auOptionMetaData } from "@/logics/api";
import {
	AU_IMPOSTOR_COUNT_OPTION_ID,
	AU_KILL_COOLDOWN_OPTION_ID,
} from "@/logics/optionUtils";
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

	const filteredOptions = categoryMeta.options.filter(
		(id) =>
			id !== AU_IMPOSTOR_COUNT_OPTION_ID && id !== AU_KILL_COOLDOWN_OPTION_ID,
	);

	if (filteredOptions.length === 0) {
		return null;
	}

	return (
		<ViewerGroupAccordion
			title={<span className={TYPOGRAPHY.LABEL}>{categoryMeta.name}</span>}
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
