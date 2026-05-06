import { ViewerGroupAccordion } from "@/components/blocks/ViewerGroupAccordion";
import { ColoredText } from "@/components/parts/ColoredText";
import { useVisibleCategories } from "@/hooks/useExROptionData";
import { exrOptionMetaData } from "@/logics/api";
import { ExRTabId } from "@/type";
import { useStore } from "@/useStore";
import { ExRCategoryListViewer } from "./ExRCategoryListViewer";

const TARGET_TAB_ID = ExRTabId.GeneralTab;

export function ExRGeneralTabOptionViewer() {
	const generalTab = exrOptionMetaData.tabs[TARGET_TAB_ID];
	const generalCategory = generalTab?.categoryIds ?? [];
	const generalTabName = generalTab?.name ?? "";
	const visibleGeneralCategory = useVisibleCategories(generalCategory);
	const isOpen = useStore(
		(state) => state.openedExRTabId[TARGET_TAB_ID] ?? true,
	);
	const toggleTab = useStore((state) => state.toggleExRTabId);

	return (
		<ViewerGroupAccordion
			title={<ColoredText text={generalTabName} />}
			isOpen={isOpen}
			onToggle={() => {
				toggleTab(TARGET_TAB_ID);
			}}
		>
			<ExRCategoryListViewer categoryIds={visibleGeneralCategory} />
		</ViewerGroupAccordion>
	);
}
