import { useBackendUpdate } from "../../hooks/useBackend";
import { updateExrOption } from "../../logics/api";
import {
	format,
	PRESET_SWITCH_MESSAGE,
	PRESET_SWITCH_TITLE,
} from "../../noTrans";
import { useStore } from "../../useStore";

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
	const presetNames = useStore((state) => state.presetNames);
	const setPresetDropdownOpen = useStore(
		(state) => state.setPresetDropdownOpen,
	);
	const setBlockDialog = useStore((state) => state.openBlockDialog);

	const backendUpdator = useBackendUpdate();

	const currentPresetName =
		presetNames[currentSelection] ?? String(presetValues[currentSelection]);

	const handlePresetSelect = (index: number) => {
		setPresetDropdownOpen(false);
		const newPreset = presetNames[index] ?? String(presetValues[index]);

		setBlockDialog({
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
				const name = presetNames[index] ?? String(val);
				const isSelected = index === currentSelection;
				return (
					<button
						key={`preset-${val}`}
						type="button"
						onClick={() => {
							handlePresetSelect(index);
						}}
						className={`
                  w-full text-left px-3 py-2 text-sm transition-colors
                  ${isSelected ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}
                `}
					>
						<div className="flex justify-between items-center">
							<span>{name}</span>
							{name !== String(val) && (
								<span className="text-xs opacity-50 ml-2">({val})</span>
							)}
						</div>
					</button>
				);
			})}
		</div>
	);
}
