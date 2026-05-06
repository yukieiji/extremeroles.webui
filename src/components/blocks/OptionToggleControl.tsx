import { useId } from "react";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { ColoredText } from "../parts/ColoredText";

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

	const handleCheckedChange = (checked: boolean) => {
		if (!disabled) {
			onChange(checked ? 1 : 0);
		}
	};

	return (
		<Field orientation="horizontal" className="gap-3 h-10 items-center">
			<Switch
				id={id}
				checked={isOn}
				onCheckedChange={handleCheckedChange}
				disabled={disabled}
				data-testid="option-toggle"
			/>
			<FieldContent>
				<FieldLabel
					htmlFor={id}
					className="text-sm font-medium text-gray-300 min-w-24 overflow-hidden text-ellipsis whitespace-nowrap"
				>
					<ColoredText text={values[selection]} />
				</FieldLabel>
			</FieldContent>
		</Field>
	);
}
