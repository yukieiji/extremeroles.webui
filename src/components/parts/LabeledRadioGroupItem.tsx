import { useId } from "react";
import { Label } from "../ui/label";
import { RadioGroupItem } from "../ui/radio-group";

interface LabeledRadioGroupItemProps {
	value: string;
	label: string;
}

/**
 * ラベル付きのRadioGroupItemコンポーネント（汎用的）
 */
export function LabeledRadioGroupItem({
	value,
	label,
}: LabeledRadioGroupItemProps) {
	const id = useId();
	return (
		<div className="flex items-center gap-2">
			<RadioGroupItem value={value} id={id} />
			<Label
				htmlFor={id}
				className="cursor-pointer font-medium text-sm text-text-primary"
			>
				{label}
			</Label>
		</div>
	);
}
