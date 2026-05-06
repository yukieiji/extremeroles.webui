import { useEffect, useRef } from "react";
import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
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

	const dropdownRef = useRef<HTMLDivElement>(null);

	// 外部クリックでドロップダウンを閉じる
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setPresetDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setPresetDropdownOpen]);

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
			<div className="relative flex items-center gap-2" ref={dropdownRef}>
				<PresetInput
					currentSelection={currentSelection}
					currentPresetValue={currentPresetValue}
				/>

				{isDropdownOpen && (
					<PresetDropdown
						currentSelection={currentSelection}
						presetValues={presetValues}
					/>
				)}
			</div>
		</HighlightWrapper>
	);
}
