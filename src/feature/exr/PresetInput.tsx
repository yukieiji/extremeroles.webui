import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
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
	const updatePresetName = useStore((state) => state.updatePresetName);

	/**
	 * ストアと LocalStorage を更新する
	 */
	const commitNameChange = (input: HTMLInputElement) => {
		const newValue = input.value.trim();
		const finalValue = newValue === "" ? String(currentPresetValue) : newValue;

		// 値が変更されている場合のみ更新を行う
		if (finalValue !== currentPresetName) {
			updatePresetName(currentSelection, finalValue);
		}

		// 入力欄の表示を確定後の値に更新する
		input.value = finalValue;
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		commitNameChange(e.currentTarget);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			commitNameChange(e.currentTarget);
			// Enter 入力後はフォーカスを外して確定を視覚的に示す
			e.currentTarget.blur();
		}
	};

	return (
		<InputGroup className="w-48 border-border-strong">
			<InputGroupInput
				type="text"
				key={currentSelection}
				defaultValue={currentPresetName}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				placeholder={PRESET_INPUT_PLACEHOLDER}
			/>
			<InputGroupAddon align="inline-end">
				<SelectTrigger
					className="border-none bg-transparent p-0"
					aria-label={PRESET_SELECT_ARIA}
				/>
			</InputGroupAddon>
		</InputGroup>
	);
}
