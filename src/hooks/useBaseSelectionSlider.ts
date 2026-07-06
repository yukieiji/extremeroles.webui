import type React from "react";
import { useEffect, useId, useRef } from "react";

/**
 * 選択スライダーの共通ロジックを管理するベースフック
 */
export function useBaseSelectionSlider(
	currentValue: number,
	commitValue: () => void,
) {
	const id = useId();
	const inputRef = useRef<HTMLInputElement>(null);

	// 外部から値が変更されたら入力欄に反映
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = currentValue.toString();
		}
	}, [currentValue]);

	const handleBlur = () => {
		commitValue();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.currentTarget.blur();
		}
	};

	const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
		e.stopPropagation();
	};

	return {
		id,
		inputRef,
		handleBlur,
		handleKeyDown,
		stopPropagation,
	};
}
