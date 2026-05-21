import type React from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useOptionSlider } from "@/hooks/useOptionSlider";
import { Field, FieldLabel, FieldSet } from "../ui/field";

interface CompactSliderProps {
	label: string;
	values: number[];
	currentSelection: number;
	onSelectionChange: (selection: number) => void;
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
	testId,
}: CompactSliderProps) {
	const {
		id,
		currentValue,
		inputRef,
		handleSliderChange,
		handleBlur,
		handleKeyDown,
	} = useOptionSlider(currentSelection, values, onSelectionChange);

	const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
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
					ref={inputRef}
					type="text"
					defaultValue={currentValue.toString()}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
				/>
			</Field>
			<Slider
				min={0}
				max={Math.max(0, values.length - 1)}
				step={1}
				value={[currentSelection]}
				onValueChange={handleSliderChange}
				className="cursor-pointer"
			/>
		</FieldSet>
	);
}
