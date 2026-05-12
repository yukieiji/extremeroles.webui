import { ChevronDownIcon } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { PRESET_INPUT_PLACEHOLDER, PRESET_SELECT_ARIA } from "@/noTrans";
import { useStore } from "@/useStore";

interface PresetInputProps {
	currentSelection: number;
	currentPresetValue: number;
}

/**
 * プリセット名を入力するための入力コンポーネント。
 * Select コンポーネントと組み合わせて使用されます。
 */
export function PresetInput({
	currentSelection,
	currentPresetValue,
	ref,
	...props
}: PresetInputProps & { ref?: React.Ref<HTMLDivElement> }) {
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
		<InputGroup ref={ref} className="w-64 cursor-default" {...props}>
			<InputGroupInput
				ref={inputRef}
				type="text"
				key={currentSelection}
				defaultValue={currentPresetName}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				onClick={(e) => e.stopPropagation()}
				onPointerDown={(e) => e.stopPropagation()}
				placeholder={PRESET_INPUT_PLACEHOLDER}
				className="rounded-r-none"
				aria-label={PRESET_INPUT_PLACEHOLDER}
			/>
			<Button
				variant="ghost"
				size="icon-sm"
				tabIndex={-1}
				className="h-8 w-9 rounded-l-none rounded-r-lg border-l border-input text-muted-foreground hover:bg-accent/50 group-focus-within/input-group:bg-accent/50"
				aria-label={PRESET_SELECT_ARIA}
			>
				<ChevronDownIcon className="size-4" />
			</Button>
		</InputGroup>
	);
}
