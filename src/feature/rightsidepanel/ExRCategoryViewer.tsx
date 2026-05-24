import { useShallow } from "zustand/react/shallow";
import { RightPanelContainer } from "@/components/blocks/RightPanelContainer";
import { ViewerGroupAccordion } from "@/components/blocks/ViewerGroupAccordion";
import { ColoredText } from "@/components/parts/ColoredText";
import { exrOptionMetaData } from "@/logics/api";
import { MOVED_EXR_OPTION_UNIQUE_IDS } from "@/logics/optionUtils";
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
			return uniqueOptions.filter((uniqueId) => {
				return (
					!(MOVED_EXR_OPTION_UNIQUE_IDS as readonly number[]).includes(uniqueId) &&
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
