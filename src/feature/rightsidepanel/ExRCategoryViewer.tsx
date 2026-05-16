import { useMemo } from "react";
import { RightPanelContainer } from "@/components/blocks/RightPanelContainer";
import { ViewerGroupAccordion } from "@/components/blocks/ViewerGroupAccordion";
import { ColoredText } from "@/components/parts/ColoredText";
import { exrOptionMetaData } from "@/logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "@/logics/optionUtils";
import { useStore } from "@/useStore";
import { ExROptionItemView } from "./ExROptionItemView";

interface ExRCategoryViewerProps {
	categoryId: number;
}

export function ExRCategoryViewer({ categoryId }: ExRCategoryViewerProps) {
	const isOpen = useStore(
		(state) => state.openedCategoryIdRightSidePanel[categoryId] ?? true,
	);
	const toggleCategory = useStore(
		(state) => state.toggleCategoryIdRightSidePanel,
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
		<ViewerGroupAccordion
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
			<RightPanelContainer arr={filteredOptions} ignoreIndex={0}>
				{(optionid) => (
					<ExROptionItemView uniqueOptionId={optionid} depth={0} />
				)}
			</RightPanelContainer>
		</ViewerGroupAccordion>
	);
}
