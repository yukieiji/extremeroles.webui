import { useMemo } from "react";
import { CompactAccordion } from "../../components/blocks/CompactAccordion";
import { RightPanelContainer } from "../../components/blocks/RightPanelContainer";
import { ColoredText } from "../../components/parts/ColoredText";
import { exrOptionMetaData } from "../../logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "../../logics/optionUtils";
import { useStore } from "../../useStore";
import { ExROptionItemView } from "./ExROptionItemView";

interface ExRCategoryViewerProp {
	categoryId: number;
}

export function ExRCategoryViewer({ categoryId }: ExRCategoryViewerProp) {
	const isOpen = useStore(
		(state) => state.openedCategoryIdRightFloatingPanel[categoryId] ?? true,
	);
	const toggleCategory = useStore(
		(state) => state.toggleCategoryIdRightFloatingPanel,
	);

	const uniqueOptions =
		exrOptionMetaData.globalCategoryIdTopLevelMap[categoryId];
	const filteredOptions = useMemo(() => {
		if (!uniqueOptions) {
			return [];
		}
		return uniqueOptions.filter((uniqueId) => {
			return uniqueId !== PRESET_OPTION_UNIQUE_ID;
		});
	}, [uniqueOptions]);

	if (filteredOptions.length === 0) {
		return null;
	}

	return (
		<CompactAccordion
			title={
				<ColoredText
					text={exrOptionMetaData.categories[categoryId]?.name ?? ""}
				/>
			}
			isOpen={isOpen}
			onToggle={() => {
				toggleCategory(categoryId);
			}}
		>
			<RightPanelContainer arr={filteredOptions}>
				{(optionid) => <ExROptionItemView uniqueOptionId={optionid} />}
			</RightPanelContainer>
		</CompactAccordion>
	);
}
