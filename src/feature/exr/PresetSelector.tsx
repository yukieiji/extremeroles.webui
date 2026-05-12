import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
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
	const presetNames = useStore((state) => state.presetNames);
	const openBlockDialog = useStore((state) => state.openBlockDialog);
	const backendUpdator = useBackendUpdate();

	if (!presetOption) {
		return null;
	}

	const currentSelection = presetOption.selection ?? 0;
	const presetValues = presetOption.values as number[];
	const currentPresetValue = presetValues[currentSelection];
	const currentPresetName =
		presetNames[currentSelection] ?? String(currentPresetValue);

	const handlePresetSelect = (value: string) => {
		const index = Number(value);
		const val = presetValues[index];
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
						selectTrigger={
							<SelectTrigger
								className="w-9 px-0 justify-center border-l-0 rounded-l-none h-8"
								aria-label={PRESET_SELECT_ARIA}
							/>
						}
					/>
				</div>
				<SelectContent align="start" className="min-w-64">
					{presetValues.map((val, index) => {
						const name = presetNames[index] ?? String(val);
						return (
							<SelectItem key={`preset-${val}`} value={String(index)}>
								<div className="flex justify-between items-center w-full gap-2">
									<span>{name}</span>
									{name !== String(val) && (
										<span className="text-xs opacity-50">({val})</span>
									)}
								</div>
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</HighlightWrapper>
	);
}
