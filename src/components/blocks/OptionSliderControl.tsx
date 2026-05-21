import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useOptionSlider } from "@/hooks/useOptionSlider";
import { OptionFormat } from "../parts/OptionFormat";
import { Field, FieldLabel, FieldSet } from "../ui/field";
import { Label } from "../ui/label";

interface OptionSliderControlProps {
	label?: string;
	selection: number;
	values: number[];
	format: string;
	onChange: (selection: number) => void;
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
}: OptionSliderControlProps) {
	const {
		id,
		currentValue,
		inputRef,
		handleSliderChange,
		handleBlur,
		handleKeyDown,
	} = useOptionSlider(selection, values, onChange);

	return (
		<FieldSet>
			<Field orientation="horizontal">
				{label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
				<Input
					id={id}
					ref={inputRef}
					type="text"
					defaultValue={currentValue.toString()}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
				/>
				<Label htmlFor={id}>
					<OptionFormat format={format} />
				</Label>
			</Field>
			<Slider
				min={0}
				max={Math.max(0, values.length - 1)}
				step={1}
				value={[selection]}
				onValueChange={handleSliderChange}
				aria-label={label}
				className="cursor-pointer"
			/>
		</FieldSet>
	);
}
