import { useShallow } from "zustand/react/shallow";
import { ColoredText } from "@/components/parts/ColoredText";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import { useExROptionNavigationInline } from "@/hooks/useOptionNavigation";
import { exrOptionMetaData } from "@/logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "@/logics/optionUtils";
import { useStore } from "@/useStore";

export function PresetSummaryRow() {
	const navigateExR = useExROptionNavigationInline();

	const selection = useStore(
		(state) => state.exrValue[PRESET_OPTION_UNIQUE_ID]?.selection ?? 0,
	);
	const presetValue = useStore(
		(state) => state.exrValue[PRESET_OPTION_UNIQUE_ID]?.values[selection] ?? "",
	);
	const presetName = useStore(
		(state) => state.presetNames[selection] ?? String(presetValue),
	);

	const presetTitle =
		exrOptionMetaData.options[PRESET_OPTION_UNIQUE_ID]?.metaData
			.translatedName ?? "プリセット";

	return (
		<ViewerOptionRow
			title={<ColoredText text={presetTitle} />}
			value={presetName}
			onDoubleClick={() => navigateExR(PRESET_OPTION_UNIQUE_ID)}
		/>
	);
}
