import type { ReactNode, RefObject } from "react";
import { TYPOGRAPHY } from "@/designConstants";
import { Field, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

interface BaseSelectionSliderLayoutProps {
	id: string;
	inputRef: RefObject<HTMLInputElement | null>;
	currentValue: number;
	selection: number;
	values: number[];
	onSliderChange: (val: number | readonly number[]) => void;
	onBlur: () => void;
	onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	stopPropagation: (e: React.MouseEvent | React.KeyboardEvent) => void;
	label?: string;
	renderFormat?: ReactNode;
	testId?: string;
	className?: string;
	inputClassName?: string;
}

/**
 * 選択スライダーのレイアウト（見た目）のみを担当するベースコンポーネント
 */
export function BaseSelectionSliderLayout({
	id,
	inputRef,
	currentValue,
	selection,
	values,
	onSliderChange,
	onBlur,
	onKeyDown,
	stopPropagation,
	label,
	renderFormat,
	testId,
	className,
	inputClassName,
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
				/>
				{renderFormat && (
					<Label htmlFor={id} className="select-text">
						{renderFormat}
					</Label>
				)}
			</Field>
			<Slider
				min={0}
				max={Math.max(0, values.length - 1)}
				step={1}
				value={[selection]}
				onValueChange={onSliderChange}
				className="cursor-pointer"
			/>
		</FieldSet>
	);
}
