import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { Select } from "@/components/ui/select";
import { useBackendUpdate } from "@/hooks/useBackend";
import { useOptionData } from "@/hooks/useExROptionData";
import { createExRNavigateId } from "@/hooks/useOptionNavigation";
import { translationMetaData, updateExrOption } from "@/logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "@/logics/optionUtils";
import { format } from "@/logics/stringUtils";
import { useStore } from "@/useStore";
import { PresetDropdown } from "./PresetDropdown";
import { PresetInput } from "./PresetInput";

/**
 * プリセットを選択・編集するためのコンポーネント。
 * CategoryId: 0, OptionId: 0 の設定を操作します。
 */

export function PresetSelector() {
	const presetOption = useOptionData(PRESET_OPTION_UNIQUE_ID);

	const isHighlighted = useStore((state) => {
		return state.highlightedExROptionId === PRESET_OPTION_UNIQUE_ID;
	});

	const setBlockDialog = useStore((state) => state.openBlockDialog);

	const backendUpdator = useBackendUpdate();

	if (!presetOption) {
		return null;
	}

	const currentSelection = presetOption.selection ?? 0;
	const presetValues = presetOption.values as number[];
	const currentPresetValue = presetValues[currentSelection];

	const handlePresetSelect = (value: string | null) => {
		if (!value) {
			return;
		}
		const index = Number(value);
		const val = presetValues[index];
		if (val === presetValues[currentSelection]) {
			return;
		}
		const { presetNames } = useStore.getState();
		const currentPresetName =
			presetNames[currentSelection] ?? String(currentPresetValue);
		const newPresetName = presetNames[index] ?? String(val);

		setBlockDialog({
			type: "confirm",
			title: translationMetaData.PRESET_SWITCH_TITLE,
			message: format(
				translationMetaData.PRESET_SWITCH_MESSAGE,
				currentPresetName,
				newPresetName,
			),
			onConfirm: () =>
				backendUpdator(async () => {
					await updateExrOption(0, 0, 0, index);
				}),
		});
	};

	const navigateId = createExRNavigateId(PRESET_OPTION_UNIQUE_ID);

	return (
		<HighlightWrapper
			id={navigateId}
			isHighlighted={isHighlighted}
			isInset={false}
		>
			<Select
				value={String(currentSelection)}
				onValueChange={handlePresetSelect}
			>
				<PresetInput
					currentSelection={currentSelection}
					currentPresetValue={currentPresetValue}
				/>
				<PresetDropdown presetValues={presetValues} />
			</Select>
		</HighlightWrapper>
	);
}
