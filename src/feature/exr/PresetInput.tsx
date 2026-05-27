import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { SelectTrigger } from "@/components/ui/select";
import { PRESET_INPUT_PLACEHOLDER, PRESET_SELECT_ARIA } from "@/noTrans";
import { useStore } from "@/useStore";

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
	const currentPresetName = useStore((state) => {
		return state.presetNames[currentSelection] ?? String(currentPresetValue);
	});
	const isDropdownOpen = useStore((state) => state.isPresetDropdownOpen);
	const updatePresetName = useStore((state) => state.updatePresetName);

	const inputRef = useRef<HTMLInputElement>(null);

	/**
	 * ストアと LocalStorage を更新する
	 */
	const commitNameChange = () => {
		if (!inputRef.current) {
			return;
		}

		const newValue = inputRef.current.value.trim();
		const finalValue = newValue === "" ? String(currentPresetValue) : newValue;

		// 値が変更されている場合のみ更新を行う
		if (finalValue !== currentPresetName) {
			updatePresetName(currentSelection, finalValue);
		}

		// 入力欄の表示を確定後の値に更新する
		inputRef.current.value = finalValue;
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
			<SelectTrigger
				className="h-auto w-auto rounded-none border-t-0 border-r-0 border-b-0 border-l border-gray-600 bg-gray-700 px-2 py-1.5 transition-colors hover:bg-gray-600 data-[placeholder]:text-gray-400 [&_svg:not([class*='size-'])]:size-4"
				aria-label={PRESET_SELECT_ARIA}
			>
				<ChevronDown
					className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
					aria-hidden="true"
				/>
			</SelectTrigger>
		</div>
	);
}
