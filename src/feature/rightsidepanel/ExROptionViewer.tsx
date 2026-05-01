import { useShallow } from "zustand/react/shallow";
import { CompactAccordion } from "../../components/blocks/CompactAccordion";
import { ColoredText } from "../../components/parts/ColoredText";
import { RightPanelGroupColumnLayout } from "../../components/parts/RightPanelGroupColumnLayout";
import { RightPanelItemColumnLayout } from "../../components/parts/RightPanelItemColumnLayout";
import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useExRNavigation } from "../../hooks/useExRNavigation";
import { useOptionData } from "../../hooks/useOptionData";
import { exrOptionMetaData } from "../../logics/api";
import { filterVisibleCategoryIds } from "../../logics/exrOptionUtils";
import { PRESET_OPTION_UNIQUE_ID } from "../../logics/optionUtils";
import { ExRTabId } from "../../type";
import { useStore } from "../../useStore";
import { ExRTab0GeneralCategory } from "./ExRTab0GeneralCategory";

/**
 * ExRの設定内容を右パネルに表示するコンポーネント
 */
export function ExROptionViewer() {
	const presetOption = useOptionData(PRESET_OPTION_UNIQUE_ID);
	const presetNames = useStore((state) => state.presetNames);
	const { navigateToExROption } = useExRNavigation();

	const visibleCategoryIds = useStore(
		useShallow((state) => {
			const categoryIds =
				exrOptionMetaData.tabs[ExRTabId.GeneralTab]?.categoryIds ?? [];
			return filterVisibleCategoryIds(categoryIds, state.isExROptionActive);
		}),
	);
	const isPresetOpen = useStore(
		(state) => state.openedExRCategoryIds[0] ?? true,
	);
	const toggleExRCategory = useStore((state) => state.toggleExRCategory);

	if (!presetOption) {
		return null;
	}

	const currentSelection = presetOption.selection ?? 0;
	const presetValues = presetOption.values as (number | string)[];
	const currentPresetValue = presetValues[currentSelection];
	const currentPresetName =
		presetNames[currentSelection] ?? String(currentPresetValue);

	const optionMeta =
		exrOptionMetaData.options[PRESET_OPTION_UNIQUE_ID]?.metaData;

	return (
		<RightPanelGroupColumnLayout>
			<CompactAccordion
				title={
					<span className="text-base">
						<ColoredText text={exrOptionMetaData.categories[0]?.name ?? ""} />
					</span>
				}
				isOpen={isPresetOpen}
				onToggle={() => toggleExRCategory(0)}
			>
				<RightPanelItemColumnLayout>
					<ViewerOptionRow
						title={
							<ColoredText text={optionMeta?.translatedName ?? "Preset"} />
						}
						value={currentPresetName}
						onDoubleClick={() => {
							navigateToExROption(0, 0, PRESET_OPTION_UNIQUE_ID);
						}}
					/>
				</RightPanelItemColumnLayout>
			</CompactAccordion>
			{visibleCategoryIds.map((categoryId) => (
				<ExRTab0GeneralCategory key={categoryId} categoryId={categoryId} />
			))}
		</RightPanelGroupColumnLayout>
	);
}
