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

interface PresetDropdownItemProps {
	index: number;
	value: number;
	isSelected: boolean;
	onSelect: (index: number, name: string) => void;
}

function PresetDropdownItem({
	index,
	value,
	isSelected,
	onSelect,
}: PresetDropdownItemProps) {
	const name = useStore((state) => {
		return state.presetNames[index] ?? String(value);
	});

	return (
		<button
			type="button"
			onClick={() => {
				onSelect(index, name);
			}}
			className={`
        w-full text-left px-3 py-2 text-sm transition-colors
        ${isSelected ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}
      `}
		>
			<div className="flex justify-between items-center">
				<span>{name}</span>
				{name !== String(value) && (
					<span className="text-xs opacity-50 ml-2">({value})</span>
				)}
			</div>
		</button>
	);
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
