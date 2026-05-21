import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useOptionSlider } from "@/hooks/useOptionSlider";
import { Field, FieldLabel, FieldSet } from "../ui/field";
import { Label } from "../ui/label";
import { OptionFormat } from "./OptionFormat";

interface OptionSliderControlProps {
	label: string;
	selection: number;
	values: number[];
	format?: string;
	onChange: (selection: number) => void;
	testId?: string;
}

/**
 * 数値オプション（Int32, Single）用のスライダーと入力欄コンポーネント
 */
export function OptionSliderControl({
	label,
	selection,
	values,
	format,
	onChange,
	testId,
}: OptionSliderControlProps) {
	const {
		id,
		currentValue,
		inputRef,
		handleSliderChange,
		handleBlur,
		handleKeyDown,
		stopPropagation,
	} = useOptionSlider(selection, values, onChange);

	return (
		<FieldSet
			onClick={stopPropagation}
			onKeyDown={stopPropagation}
			data-testid={testId}
			aria-label={label}
		>
			<Field orientation="horizontal">
				<FieldLabel
					htmlFor={id}
					className="text-sm font-medium"
					aria-hidden="true"
				>
					{label}
				</FieldLabel>
				<Input
					id={id}
					ref={inputRef}
					type="text"
					defaultValue={currentValue.toString()}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
				/>
				{format && (
					<Label htmlFor={id}>
						<OptionFormat format={format} />
					</Label>
				)}
			</Field>
			<Slider
				min={0}
				max={Math.max(0, values.length - 1)}
				step={1}
				value={[selection]}
				onValueChange={handleSliderChange}
				aria-label={`${label} slider`}
				className="cursor-pointer"
			/>
		</FieldSet>
	);
}
