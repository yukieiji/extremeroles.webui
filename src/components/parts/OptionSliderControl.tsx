import type React from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useOptionSlider } from "@/hooks/useOptionSlider";
import { Field, FieldLabel, FieldSet } from "../ui/field";
import { Label } from "../ui/label";
import { OptionFormat } from "./OptionFormat";

interface OptionSliderControlProps {
	label?: string;
	selection: number;
	values: number[];
	format?: string;
	onChange: (selection: number) => void;
	onInputChange?: (value: number) => void;
	testId?: string;
}

/**
 * 数値オプション（Int32, Single）用のスライダーと入力欄コンポーネント
 */
export function OptionSliderControl({
	label,
	selection,
	values,
	format = "",
	onChange,
	onInputChange,
	testId,
}: OptionSliderControlProps) {
	const {
		id,
		currentValue,
		inputRef,
		handleSliderChange,
		handleBlur,
		handleKeyDown,
	} = useOptionSlider(selection, values, onChange);

	const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
		e.stopPropagation();
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		if (onInputChange) {
			const val = parseFloat(e.target.value);
			if (!Number.isNaN(val)) {
				onInputChange(val);
			}
		}
	};

	// 外部から onInputChange が渡されている場合は、リアルタイム更新の挙動にする
	// 渡されていない場合は useOptionSlider の挙動 (blur/Enterで確定) にする
	const isRealtime = !!onInputChange;

	return (
		<FieldSet
			onClick={stopPropagation}
			onKeyDown={stopPropagation}
			data-testid={testId}
		>
			<Field orientation="horizontal">
				{label && (
					<FieldLabel htmlFor={id} className="text-sm font-medium">
						{label}
					</FieldLabel>
				)}
				<Input
					id={id}
					ref={isRealtime ? undefined : inputRef}
					type="text"
					value={isRealtime ? currentValue : undefined}
					defaultValue={isRealtime ? undefined : currentValue.toString()}
					onBlur={isRealtime ? undefined : handleBlur}
					onKeyDown={isRealtime ? undefined : handleKeyDown}
					onChange={isRealtime ? handleInputChange : (e) => e.stopPropagation()}
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
