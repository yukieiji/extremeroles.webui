import { useRef } from "react";
import { PRESET_INPUT_PLACEHOLDER, PRESET_SELECT_ARIA } from "../../noTrans";
import { useStore } from "../../useStore";

interface PresetInputProps {
	currentSelection: number;
	currentPresetValue: number;
}

/**
 * プリセット名を入力し、ドロップダウンを切り替えるための入力コンポーネント
 */
export function PresetInput({
	currentSelection,
	currentPresetValue,
}: PresetInputProps) {
	const presetNames = useStore((state) => state.presetNames);
	const isDropdownOpen = useStore((state) => state.isPresetDropdownOpen);
	const updatePresetName = useStore((state) => state.updatePresetName);
	const setPresetDropdownOpen = useStore(
		(state) => state.setPresetDropdownOpen,
	);

	const inputRef = useRef<HTMLInputElement>(null);

	const currentPresetName =
		presetNames[currentSelection] ?? String(currentPresetValue);

	/**
	 * ストアと LocalStorage を更新する
	 */
	const commitNameChange = () => {
		if (inputRef.current) {
			const value = inputRef.current.value.trim();
			updatePresetName(currentSelection, value);
			if (value === "") {
				inputRef.current.value = String(currentPresetValue);
			}
		}
	};

	const handleBlur = () => {
		commitNameChange();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			commitNameChange();
			// Enter 入力後はフォーカスを外して確定を視覚的に示す
			e.currentTarget.blur();
		}
	};

	const toggleDropdown = () => {
		setPresetDropdownOpen(!isDropdownOpen);
	};

	return (
		<div className="relative flex items-center bg-gray-800 border border-gray-700 rounded overflow-hidden focus-within:bg-gray-600">
			<input
				ref={inputRef}
				type="text"
				key={currentSelection}
				defaultValue={currentPresetName}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				className="px-3 py-1.5 text-sm bg-transparent text-gray-200 outline-none w-48"
				placeholder={PRESET_INPUT_PLACEHOLDER}
			/>
			<button
				type="button"
				onClick={toggleDropdown}
				className="px-2 py-1.5 bg-gray-700 hover:bg-gray-600 border-l border-gray-600 transition-colors"
				aria-label={PRESET_SELECT_ARIA}
			>
				<svg
					className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>
		</div>
	);
}
