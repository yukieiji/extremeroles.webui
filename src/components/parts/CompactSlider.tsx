import { useEffect, useRef, useState } from "react";
import type React from "react";

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
 * (純粋なUIコンポーネント)
 * 入力欄はスライダーの上に表示されるようにレイアウト
 */
export function CompactSlider({
	label,
	values,
	currentSelection,
	onSelectionChange,
	onInputChange,
	testId,
}: CompactSliderProps) {
	const [localSelection, setLocalSelection] = useState(currentSelection);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Propsが変わった場合にローカルの状態を同期させる
	useEffect(() => {
		setLocalSelection(currentSelection);
	}, [currentSelection]);

	const currentValue = values[localSelection] ?? values[0] ?? 0;

	const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		const newSelection = parseInt(e.target.value, 10);
		setLocalSelection(newSelection);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			onSelectionChange(newSelection);
		}, 300);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.stopPropagation();
		const val = parseFloat(e.target.value);
		if (!Number.isNaN(val)) {
			onInputChange(val);
		}
	};

	const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
		// アコーディオンの開閉を防ぐ
		e.stopPropagation();
	};

	return (
		<fieldset
			className="flex flex-col gap-1 px-2 py-1 bg-gray-900/50 rounded border border-gray-700/50 text-left cursor-default"
			onClick={handleClick}
			onKeyDown={handleClick}
			aria-label={label}
			data-testid={testId}
		>
			<div className="flex items-center justify-between gap-2">
				<span className="text-[10px] font-medium text-gray-400 whitespace-nowrap leading-none">
					{label}
				</span>
				<input
					type="text"
					value={currentValue}
					onChange={handleInputChange}
					className="w-8 px-0.5 py-0 text-right text-[10px] bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:border-blue-500 leading-none"
				/>
			</div>
			<input
				type="range"
				min={0}
				max={values.length - 1}
				step={1}
				value={localSelection}
				onChange={handleSliderChange}
				className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
			/>
		</fieldset>
	);
}
