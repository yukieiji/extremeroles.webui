import type { ReactNode, RefObject } from "react";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TYPOGRAPHY } from "@/designConstants";

interface BaseSelectionSliderLayoutProps {
	id: string;
	inputRef: RefObject<HTMLInputElement | null>;
	currentValue: number;
	sliderMin: number;
	sliderMax: number;
	sliderValue: number;
	onSliderChange: (val: number | readonly number[]) => void;
	onBlur: () => void;
	onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	stopPropagation: (e: React.MouseEvent | React.KeyboardEvent) => void;
	label?: string;
	renderFormat?: ReactNode;
	testId?: string;
	className?: string;
	inputClassName?: string;
	disabled: boolean;
}

/**
 * 選択スライダーのレイアウト（見た目）のみを担当するベースコンポーネント
 */
export function BaseSelectionSliderLayout({
	id,
	inputRef,
	currentValue,
	sliderMin,
	sliderMax,
	sliderValue,
	onSliderChange,
	onBlur,
	onKeyDown,
	stopPropagation,
	label,
	renderFormat,
	testId,
	className,
	inputClassName,
	disabled,
}: BaseSelectionSliderLayoutProps) {
	return (
		<FieldSet
			onClick={stopPropagation}
			onKeyDown={stopPropagation}
			data-testid={testId}
			className={className}
		>
			<Field orientation="horizontal">
				{label && (
					<FieldLabel
						htmlFor={id}
						className={`${TYPOGRAPHY.CHILD_LABEL} select-text w-full`}
						aria-hidden="true"
					>
						{label}
					</FieldLabel>
				)}
				<Input
					id={id}
					ref={inputRef}
					type="number"
					defaultValue={currentValue.toString()}
					onBlur={onBlur}
					onKeyDown={onKeyDown}
					className={inputClassName}
					disabled={disabled}
				/>
				{renderFormat && (
					<Label htmlFor={id} className="select-text">
						{renderFormat}
					</Label>
				)}
			</Field>
			<Slider
				min={sliderMin}
				max={sliderMax}
				step={1}
				value={[sliderValue]}
				onValueChange={onSliderChange}
				disabled={disabled}
				className="cursor-pointer"
			/>
		</FieldSet>
	);
}
