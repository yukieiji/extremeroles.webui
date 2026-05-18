import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useId } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { findClosestIndex } from "@/logics/optionUtils";
import { useStore } from "@/useStore";
import { OptionFormat } from "../parts/OptionFormat";
import { Field } from "../ui/field";
import { Label } from "../ui/label";

interface OptionSliderControlProps {
	selection: number;
	values: number[];
	format: string;
	onChange: (selection: number) => void;
}

/**
 * 数値オプション（Int32, Single）用のスライダーと入力欄コンポーネント
 */
export function OptionSliderControl({
	selection,
	values,
	format,
	onChange,
}: OptionSliderControlProps) {
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
		<div className="flex items-center">
			<Slider
				min={0}
				max={values.length - 1}
				step={1}
				value={[selection]}
				onValueChange={handleSliderChange}
				className="cursor-pointer"
			/>
			<Field orientation="horizontal">
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
		</div>
	);
}
