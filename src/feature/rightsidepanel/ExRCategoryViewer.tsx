import { useShallow } from "zustand/react/shallow";
import { RightPanelContainer } from "@/components/blocks/RightPanelContainer";
import { ViewerGroupAccordion } from "@/components/blocks/ViewerGroupAccordion";
import { ColoredText } from "@/components/parts/ColoredText";
import { exrOptionMetaData } from "@/logics/api";
import { getUniqueOptionId, PRESET_OPTION_UNIQUE_ID } from "@/logics/optionUtils";
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

	const activeOptions = useStore(
		useShallow((state) => {
			if (!uniqueOptions) {
				return [];
			}
			const movedOptionIds = [
				PRESET_OPTION_UNIQUE_ID,
				getUniqueOptionId(0, 5, 0), // Crew Min
				getUniqueOptionId(0, 5, 1), // Crew Max
				getUniqueOptionId(0, 5, 2), // Neutral Min
				getUniqueOptionId(0, 5, 3), // Neutral Max
				getUniqueOptionId(0, 5, 4), // Impostor Min
				getUniqueOptionId(0, 5, 5), // Impostor Max
				getUniqueOptionId(0, 5, 6), // Liberal Min
				getUniqueOptionId(0, 5, 7), // Liberal Max
				getUniqueOptionId(0, 7, 22), // Militant Min
				getUniqueOptionId(0, 7, 23), // Militant Max
			];
			return uniqueOptions.filter((uniqueId) => {
				return (
					!movedOptionIds.includes(uniqueId) &&
					state.isExROptionActive[uniqueId]
				);
			});
		}),
	);

	if (activeOptions.length === 0) {
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
			<RightPanelContainer arr={activeOptions} ignoreIndex={0}>
				{(optionid) => <ExROptionItemView uniqueOptionId={optionid} />}
			</RightPanelContainer>
		</ViewerGroupAccordion>
	);
}
