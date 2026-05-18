import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { useEffect, useId } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useStore } from "@/useStore";
import { Field, FieldLabel, FieldSet } from "../ui/field";

interface CompactSliderProps {
	label: string;
	values: number[];
	currentSelection: number;
	onSelectionChange: (selection: number) => void;
	onInputChange: (value: number) => void;
	testId?: string;
}

/**
 * カテゴリアコーディオンのヘッダーなどで使用する、コンパクトなスライダーとテキスト入力のセット
 * shadcn/uiベースのコンポーネントを使用
 */
export function CompactSlider({
	label,
	values,
	currentSelection,
	onSelectionChange,
	onInputChange,
	testId,
}: CompactSliderProps) {
	const id = useId();
	const currentValue = values[currentSelection] ?? values[0] ?? 0;

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
		onSelectionChange(Array.isArray(val) ? val[0] : val);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		const nextValue = e.target.value;
		setSliderInput(id, nextValue);
	};

	const commitInput = () => {
		if (inputValueFromStore === undefined) {
			return;
		}

		const val = parseFloat(inputValueFromStore);
		if (!Number.isNaN(val)) {
			onInputChange(val);
		}
		clearSliderInput(id);
	};

	const handleBlur = () => {
		commitInput();
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		e.stopPropagation();
		if (e.key === "Enter") {
			commitInput();
		}
	};

	const stopPropagation = (e: MouseEvent | KeyboardEvent) => {
		e.stopPropagation();
	};

	return (
		<FieldSet
			onClick={stopPropagation}
			onKeyDown={stopPropagation}
			data-testid={testId}
			aria-label={label}
		>
			<Field orientation="horizontal">
				<FieldLabel htmlFor={id} className="text-sm font-medium">
					{label}
				</FieldLabel>
				<Input
					id={id}
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
				/>
			</Field>
			<Slider
				min={0}
				max={values.length - 1}
				step={1}
				value={[currentSelection]}
				onValueChange={handleSliderChange}
				className="cursor-pointer"
			/>
		</FieldSet>
	);
}
