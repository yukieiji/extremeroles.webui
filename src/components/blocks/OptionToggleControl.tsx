import { useId } from "react";
import { TYPOGRAPHY } from "@/designConstants";
import { ColoredText } from "../parts/ColoredText";
import { Field, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";

interface OptionToggleControlProps {
	selection: number; // 0 or 1
	values: string[];
	onChange: (selection: number) => void;
	disabled?: boolean;
}

/**
 * 特定の条件を満たす文字列オプション用のトグルスイッチコンポーネント
 */
export function OptionToggleControl({
	selection,
	values,
	onChange,
	disabled = false,
}: OptionToggleControlProps) {
	const id = useId();
	const isOn = selection === 1;

	const handleToggle = () => {
		if (disabled) {
			return;
		}
		onChange(isOn ? 0 : 1);
	};

	return (
		<Field orientation="horizontal">
			<Switch
				id={id}
				onClick={handleToggle}
				checked={isOn}
				disabled={disabled}
				className="cursor-pointer"
				data-testid="option-toggle"
			/>
			<FieldLabel htmlFor={id} className="select-text">
				<ColoredText
					text={values[selection]}
					variant="secondary"
					className={TYPOGRAPHY.CHILD_LABEL}
				/>
			</FieldLabel>
		</Field>
	);
}
