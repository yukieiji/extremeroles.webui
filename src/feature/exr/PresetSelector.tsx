import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useOptionData } from "@/hooks/useExROptionData";
import { createExRNavigateId } from "@/hooks/useOptionNavigation";
import { PRESET_OPTION_UNIQUE_ID } from "@/logics/optionUtils";
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

	if (!presetOption) {
		return null;
	}

	const currentSelection = presetOption.selection ?? 0;
	const presetValues = presetOption.values as number[];
	const currentPresetValue = presetValues[currentSelection];

	const navigateId = createExRNavigateId(PRESET_OPTION_UNIQUE_ID);

	return (
		<HighlightWrapper
			id={navigateId}
			isHighlighted={isHighlighted}
			isInset={false}
		>
			<Popover open={isDropdownOpen} onOpenChange={setPresetDropdownOpen}>
				<div className="relative flex items-center gap-2">
					<PresetInput
						currentSelection={currentSelection}
						currentPresetValue={currentPresetValue}
					/>
					<PopoverTrigger className="sr-only">Open presets</PopoverTrigger>
				</div>
				<PopoverContent className="w-64 p-0" align="start">
					<PresetDropdown
						currentSelection={currentSelection}
						presetValues={presetValues}
					/>
				</PopoverContent>
			</Popover>
		</HighlightWrapper>
	);
}
