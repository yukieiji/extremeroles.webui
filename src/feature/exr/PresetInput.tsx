import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import {
	InputGroup,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
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
	const setPresetDropdownOpen = useStore(
		(state) => state.setPresetDropdownOpen,
	);

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

	const toggleDropdown = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setPresetDropdownOpen(!isDropdownOpen);
	};

	return (
		<InputGroup className="w-64">
			<InputGroupInput
				ref={inputRef}
				type="text"
				key={currentSelection}
				defaultValue={currentPresetName}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				placeholder={PRESET_INPUT_PLACEHOLDER}
			/>
			<InputGroupButton
				onClick={toggleDropdown}
				aria-label={PRESET_SELECT_ARIA}
				size="icon-sm"
			>
				<ChevronDown
					className={`text-muted-foreground transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
					aria-hidden="true"
				/>
			</InputGroupButton>
		</InputGroup>
	);
}
