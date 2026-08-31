import { useShallow } from "zustand/react/shallow";
import { RightPanelContainer } from "@/components/blocks/RightPanelContainer";
import { ViewerGroupAccordion } from "@/components/blocks/ViewerGroupAccordion";
import { ColoredText } from "@/components/parts/ColoredText";
import { TYPOGRAPHY } from "@/designConstants";
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
			const displayMode = state.appSetting?.inactiveOptionDisplay ?? "hidden";
			return uniqueOptions.filter((uniqueId) => {
				const isMoved = (
					MOVED_EXR_OPTION_UNIQUE_IDS as readonly number[]
				).includes(uniqueId);
				if (isMoved) {
					return false;
				}
				if (displayMode !== "hidden") {
					return true;
				}
				return state.isExROptionActive[uniqueId];
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
					className={TYPOGRAPHY.LABEL}
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
