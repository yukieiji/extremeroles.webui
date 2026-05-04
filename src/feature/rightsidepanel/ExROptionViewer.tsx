import { RightPanelItemColumnLayout } from "../../components/parts/RightPanelItemColumnLayout";
import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useOptionData } from "../../hooks/useExROptionData";
import { useExRNavigation } from "../../hooks/useOptionNavigation";
import { exrOptionMetaData } from "../../logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "../../logics/optionUtils";
import { useStore } from "../../useStore";
import { ExRGeneralTabOptionViewer } from "./ExRGeneralTabOptionViewer";

/**
 * ExRの設定内容を右パネルに表示するコンポーネント
 */
export function ExROptionViewer() {
	const presetOption = useOptionData(PRESET_OPTION_UNIQUE_ID);
	const currentSelection = presetOption?.selection ?? 0;
	const currentRecordPreset = useStore(
		(state) => state.presetNames[currentSelection],
	);
	const navigate = useExRNavigation(PRESET_OPTION_UNIQUE_ID);

	const currentPresetValue = presetOption?.values[currentSelection] ?? "";
	const currentPresetName = currentRecordPreset ?? String(currentPresetValue);

	const optionMeta =
		exrOptionMetaData.options[PRESET_OPTION_UNIQUE_ID]?.metaData;

	return (
		<RightPanelItemColumnLayout>
			<ViewerOptionRow
				title={optionMeta?.translatedName ?? "Preset"}
				value={currentPresetName}
				onDoubleClick={navigate}
			/>
			<ExRGeneralTabOptionViewer />
		</RightPanelItemColumnLayout>
	);
}
