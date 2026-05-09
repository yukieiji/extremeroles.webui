import type React from "react";
import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

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

	const handleSliderChange = (val: number | readonly number[]) => {
		onSelectionChange(Array.isArray(val) ? val[0] : val);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		const val = parseFloat(e.target.value);
		if (!Number.isNaN(val)) {
			onInputChange(val);
		}
	};

	const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
		e.stopPropagation();
	};

	return (
		<fieldset
			className="flex flex-col gap-2"
			onClick={stopPropagation}
			onKeyDown={stopPropagation}
			data-testid={testId}
			aria-label={label}
		>
			<div className="flex items-center justify-between gap-4">
				<Label htmlFor={id} className="text-sm font-medium">
					{label}
				</Label>
				<Input
					id={id}
					type="text"
					value={currentValue}
					onChange={handleInputChange}
					className="h-8 w-16 px-2 text-right"
				/>
			</div>
			<Slider
				min={0}
				max={values.length - 1}
				step={1}
				value={[currentSelection]}
				onValueChange={handleSliderChange}
				className="cursor-pointer"
			/>
		</fieldset>
	);
}
