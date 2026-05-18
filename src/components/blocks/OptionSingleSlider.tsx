import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useId } from "react";
import { findClosestIndex } from "@/logics/optionUtils";
import { useStore } from "@/useStore";
import { OptionFormat } from "../parts/OptionFormat";
import { Field, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

interface OptionSingleSliderProps {
	label: string;
	selection: number;
	values: number[];
	format: string;
	onChange: (selection: number) => void;
}

export function OptionSingleSlider({
	label,
	selection,
	values,
	format,
	onChange,
}: OptionSingleSliderProps) {
	const id = useId();
	const currentValue = values[selection] ?? values[0] ?? 0;

	// Zustandストアを使用して入力値を管理（AGENTS.mdのルールに従い、useStateは使用しない）
	const inputValueFromStore = useStore((state) => {
		return state.sliderInputs[id];
	});
	const setSliderInput = useStore((state) => {
		return state.setSliderInput;
	});
	const clearSliderInput = useStore((state) => {
		return state.clearSliderInput;
	});

	const inputValue = inputValueFromStore ?? currentValue.toString();

	// biome-ignore lint/correctness/useExhaustiveDependencies: currentValue is used to trigger clear
	useEffect(() => {
		// 値が外部から変更された場合（スライダー操作など）、入力値をクリアしてプロップと同期させる
		clearSliderInput(id);
		// currentValue は依存関係に含める必要がある（値が変わった時にクリアしたいため）
	}, [currentValue, id, clearSliderInput]);

	const handleSliderChange = (val: number | readonly number[]) => {
		onChange(Array.isArray(val) ? val[0] : val);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const nextValue = e.target.value;
		setSliderInput(id, nextValue);
	};

	const commitInput = () => {
		if (inputValueFromStore === undefined) {
			return;
		}

		const val = parseFloat(inputValueFromStore);
		if (!Number.isNaN(val)) {
			onChange(findClosestIndex(values, val));
		}
		clearSliderInput(id);
	};

	const handleBlur = () => {
		commitInput();
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			commitInput();
		}
	};

	return (
		<FieldSet>
			<Field orientation="horizontal">
				<FieldLabel htmlFor={id}>{label}</FieldLabel>
				<Input
					id={id}
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
				/>
				<Label htmlFor={id}>
					<OptionFormat format={format} />
				</Label>
			</Field>
			<Slider
				min={0}
				max={values.length - 1}
				step={1}
				value={[selection]}
				onValueChange={handleSliderChange}
				aria-label={label}
				className="cursor-pointer"
			/>
		</FieldSet>
	);
}
