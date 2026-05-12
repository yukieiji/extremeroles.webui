import { type ReactNode, useRef } from "react";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { PRESET_INPUT_PLACEHOLDER } from "@/noTrans";
import { useStore } from "@/useStore";

interface PresetInputProps {
	currentSelection: number;
	currentPresetValue: number;
	children: ReactNode;
}

/**
 * プリセット名を入力するための入力コンポーネント。
 * Select コンポーネントと組み合わせて使用されます。
 */
export function PresetInput({
	currentSelection,
	currentPresetValue,
	children,
}: PresetInputProps) {
	const currentPresetName = useStore((state) => {
		return state.presetNames[currentSelection] ?? String(currentPresetValue);
	});
	const updatePresetName = useStore((state) => state.updatePresetName);

	const inputRef = useRef<HTMLInputElement>(null);

	const commitNameChange = () => {
		if (!inputRef.current) {
			return;
		}

		const newValue = inputRef.current.value.trim();
		const finalValue = newValue === "" ? String(currentPresetValue) : newValue;

		if (finalValue !== currentPresetName) {
			updatePresetName(currentSelection, finalValue);
		}

		inputRef.current.value = finalValue;
	};

	const handleBlur = () => {
		commitNameChange();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			commitNameChange();
			e.currentTarget.blur();
		}
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
				className="rounded-r-none"
				aria-label={PRESET_INPUT_PLACEHOLDER}
			/>
			{children}
		</InputGroup>
	);
}
