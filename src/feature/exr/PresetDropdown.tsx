import { useBackendUpdate } from "../../hooks/useBackend";
import { updateExrOption } from "../../logics/api";
import {
	format,
	PRESET_SWITCH_MESSAGE,
	PRESET_SWITCH_TITLE,
} from "../../noTrans";
import { useStore } from "../../useStore";
import { PresetDropdownItem } from "./PresetDropdownItem";

interface PresetDropdownProps {
	currentSelection: number;
	presetValues: number[];
}

/**
 * プリセットの選択肢を表示するドロップダウンリストコンポーネント
 */
export function PresetDropdown({
	currentSelection,
	presetValues,
}: PresetDropdownProps) {
	const currentPresetName = useStore((state) => {
		return (
			state.presetNames[currentSelection] ??
			String(presetValues[currentSelection])
		);
	});
	const setPresetDropdownOpen = useStore(
		(state) => state.setPresetDropdownOpen,
	);
	const setBlockDialog = useStore((state) => state.openBlockDialog);

	const backendUpdator = useBackendUpdate();

	const handlePresetSelect = (index: number, newPreset: string) => {
		setPresetDropdownOpen(false);

		setBlockDialog({
			type: "confirm",
			title: PRESET_SWITCH_TITLE,
			message: format(PRESET_SWITCH_MESSAGE, currentPresetName, newPreset),
			onConfirm: () =>
				backendUpdator(async () => {
					await updateExrOption(0, 0, 0, index);
				}),
		});
	};

	return (
		<div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-700 rounded shadow-xl z-50 max-h-60 overflow-y-auto">
			{presetValues.map((val, index) => {
				const isSelected = index === currentSelection;
				return (
					<PresetDropdownItem
						key={`preset-${val}`}
						index={index}
						value={val}
						isSelected={isSelected}
						onSelect={handlePresetSelect}
					/>
				);
			})}
		</div>
	);
}
