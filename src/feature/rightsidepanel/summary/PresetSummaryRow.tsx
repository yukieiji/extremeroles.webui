import { useShallow } from "zustand/react/shallow";
import { ColoredText } from "@/components/parts/ColoredText";
import { ViewerOptionRow } from "@/components/parts/ViewerOptionRow";
import { useExROptionNavigationInline } from "@/hooks/useOptionNavigation";
import { exrOptionMetaData } from "@/logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "@/logics/optionUtils";
import { useStore } from "@/useStore";

export function PresetSummaryRow() {
	const navigateExR = useExROptionNavigationInline();
	const presetName = useStore(
		useShallow((state) => {
			const option = state.exrValue[PRESET_OPTION_UNIQUE_ID];
			const selection = option?.selection ?? 0;
			return (
				state.presetNames[selection] ?? String(option?.values[selection] ?? "")
			);
		}),
	);

	const presetTitle =
		exrOptionMetaData.options[PRESET_OPTION_UNIQUE_ID]?.metaData
			.translatedName ?? "プリセット";

	return (
		<ViewerOptionRow
			title={<ColoredText text={presetTitle} variant="secondary" />}
			value={presetName}
			onDoubleClick={() => navigateExR(PRESET_OPTION_UNIQUE_ID)}
		/>
	);
}
