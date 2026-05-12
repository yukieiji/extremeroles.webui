import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { useBackendUpdate } from "@/hooks/useBackend";
import { useOptionData } from "@/hooks/useExROptionData";
import { createExRNavigateId } from "@/hooks/useOptionNavigation";
import { updateExrOption } from "@/logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "@/logics/optionUtils";
import {
	format,
	PRESET_SELECT_ARIA,
	PRESET_SWITCH_MESSAGE,
	PRESET_SWITCH_TITLE,
} from "@/noTrans";
import { useStore } from "@/useStore";
import { PresetInput } from "./PresetInput";
import { PresetSelectItem } from "./PresetSelectItem";

/**
 * プリセットを選択・編集するためのコンポーネント。
 * CategoryId: 0, OptionId: 0 の設定を操作します。
 */
export function PresetSelector() {
	const presetOption = useOptionData(PRESET_OPTION_UNIQUE_ID);

	const isDropdownOpen = useStore((state) => state.isPresetDropdownOpen);
	const setPresetDropdownOpen = useStore(
		(state) => state.setPresetDropdownOpen,
	);
	const isHighlighted = useStore(
		(state) => state.highlightedExROptionId === PRESET_OPTION_UNIQUE_ID,
	);
	const openBlockDialog = useStore((state) => state.openBlockDialog);
	const backendUpdator = useBackendUpdate();

	if (!presetOption) {
		return null;
	}

	const currentSelection = presetOption.selection ?? 0;
	const presetValues = presetOption.values as number[];
	const currentPresetValue = presetValues[currentSelection];

	const handlePresetSelect = (value: string) => {
		const index = Number(value);
		const val = presetValues[index];

		// ストアから最新の情報を取得
		const { presetNames } = useStore.getState();
		const currentPresetName =
			presetNames[currentSelection] ?? String(currentPresetValue);
		const newPresetName = presetNames[index] ?? String(val);

		openBlockDialog({
			type: "confirm",
			title: PRESET_SWITCH_TITLE,
			message: format(PRESET_SWITCH_MESSAGE, currentPresetName, newPresetName),
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
				open={isDropdownOpen}
				onOpenChange={setPresetDropdownOpen}
				value={String(currentSelection)}
				onValueChange={handlePresetSelect}
			>
				<div className="relative flex items-center gap-2">
					<PresetInput
						currentSelection={currentSelection}
						currentPresetValue={currentPresetValue}
					>
						<SelectTrigger
							className="h-8 w-9 justify-center rounded-l-none border-l-0 px-0"
							aria-label={PRESET_SELECT_ARIA}
						/>
					</PresetInput>
				</div>
				<SelectContent alignItemWithTrigger={false} className="min-w-64">
					{presetValues.map((val, index) => (
						<PresetSelectItem key={`preset-${val}`} index={index} value={val} />
					))}
				</SelectContent>
			</Select>
		</HighlightWrapper>
	);
}
