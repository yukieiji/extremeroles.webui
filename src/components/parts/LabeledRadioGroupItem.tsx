import { useId } from "react";
import { TYPOGRAPHY } from "@/designConstants";
import { Field, FieldLabel } from "../ui/field";
import { RadioGroupItem } from "../ui/radio-group";

interface LabeledRadioGroupItemProps {
	value: string;
	label: string;
	orientation?: "horizontal" | "vertical";
}

/**
 * ラベル付きのRadioGroupItemコンポーネント（汎用的）
 */
export function LabeledRadioGroupItem({
	value,
	label,
	orientation = "horizontal",
}: LabeledRadioGroupItemProps) {
	const id = useId();
	return (
		<Field orientation={orientation}>
			<RadioGroupItem value={value} id={id} className="cursor-pointer" />
			<FieldLabel
				htmlFor={id}
				className={`text-text-primary ${TYPOGRAPHY.CHILD_LABEL}`}
			>
				{label}
			</FieldLabel>
		</Field>
	);
}
