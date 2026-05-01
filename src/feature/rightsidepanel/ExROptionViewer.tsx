import { RightPanelItemColumnLayout } from "../../components/parts/RightPanelItemColumnLayout";
import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useExRNavigation } from "../../hooks/useExRNavigation";
import { useOptionData } from "../../hooks/useOptionData";
import { exrOptionMetaData } from "../../logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "../../logics/optionUtils";
import { useStore } from "../../useStore";

/**
 * ExRの設定内容を右パネルに表示するコンポーネント
 */
export function ExROptionViewer() {
	const presetOption = useOptionData(PRESET_OPTION_UNIQUE_ID);
	const presetNames = useStore((state) => state.presetNames);
	const { navigateToExROption } = useExRNavigation();

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
		<RightPanelItemColumnLayout>
			<ViewerOptionRow
				title={optionMeta?.translatedName ?? "Preset"}
				value={currentPresetName}
				onDoubleClick={() => {
					navigateToExROption(0, 0, PRESET_OPTION_UNIQUE_ID);
				}}
			/>
		</RightPanelItemColumnLayout>
	);
}
