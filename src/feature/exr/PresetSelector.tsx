import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { Select } from "@/components/ui/select";
import { useBackendUpdate } from "@/hooks/useBackend";
import { useOptionData } from "@/hooks/useExROptionData";
import { createExRNavigateId } from "@/hooks/useOptionNavigation";
import { updateExrOption } from "@/logics/api";
import { PRESET_OPTION_UNIQUE_ID } from "@/logics/optionUtils";
import { format, PRESET_SWITCH_MESSAGE, PRESET_SWITCH_TITLE } from "@/noTrans";
import { useStore } from "@/useStore";
import { PresetDropdown } from "./PresetDropdown";
import { PresetInput } from "./PresetInput";

/**
 * プリセットを選択・編集するためのコンポーネント。
 * CategoryId: 0, OptionId: 0 の設定を操作します。
 * AGENT.md のガイドラインに従い、useState を使用せず、グローバルストアで状態を管理します。
 */

export function PresetSelector() {
	const presetOption = useOptionData(PRESET_OPTION_UNIQUE_ID);

	const isDropdownOpen = useStore((state) => {
		return state.isPresetDropdownOpen;
	});
	const setPresetDropdownOpen = useStore((state) => {
		return state.setPresetDropdownOpen;
	});
	const isHighlighted = useStore((state) => {
		return state.highlightedExROptionId === PRESET_OPTION_UNIQUE_ID;
	});

	const currentSelection = presetOption?.selection ?? 0;
	const presetValues = (presetOption?.values as number[]) ?? [];
	const currentPresetValue = presetValues[currentSelection];

	const navigateId = createExRNavigateId(PRESET_OPTION_UNIQUE_ID);

	const currentPresetName = useStore((state) => {
		return (
			state.presetNames[currentSelection] ??
			String(presetValues[currentSelection])
		);
	});
	const setBlockDialog = useStore((state) => state.openBlockDialog);
	const backendUpdator = useBackendUpdate();

	if (!presetOption) {
		return null;
	}

	const handleValueChange = (value: string) => {
		const index = Number.parseInt(value, 10);
		if (index === currentSelection) {
			return;
		}

		const newPresetName =
			useStore.getState().presetNames[index] ?? String(presetValues[index]);

		setBlockDialog({
			type: "confirm",
			title: PRESET_SWITCH_TITLE,
			message: format(PRESET_SWITCH_MESSAGE, currentPresetName, newPresetName),
			onConfirm: () =>
				backendUpdator(async () => {
					setPresetDropdownOpen(false);
					await updateExrOption(0, 0, 0, index);
				}),
			onCancel: () => {
				setPresetDropdownOpen(false);
			},
		});
	};

	return (
		<HighlightWrapper
			id={navigateId}
			isHighlighted={isHighlighted}
			isInset={false}
		>
			<Select
				open={isDropdownOpen}
				onOpenChange={setPresetDropdownOpen}
				onValueChange={handleValueChange}
				value={String(currentSelection)}
			>
				<div className="relative flex items-center gap-2">
					<PresetInput
						currentSelection={currentSelection}
						currentPresetValue={currentPresetValue}
					/>

					<PresetDropdown presetValues={presetValues} />
				</div>
			</Select>
		</HighlightWrapper>
	);
}
