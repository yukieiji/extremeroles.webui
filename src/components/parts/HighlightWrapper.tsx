import type { ReactNode } from "react";

interface HighlightWrapperProps {
	isHighlighted: boolean;
	children: ReactNode;
	id?: string;
}

/**
 * ハイライト状態を表示するためのラッパーコンポーネント
 */
export function HighlightWrapper({
	isHighlighted,
	children,
	id,
}: HighlightWrapperProps) {
	return (
		<div
			id={id}
			className={`transition-all duration-500 rounded ${
				isHighlighted ? "ring-2 ring-blue-500" : ""
			}`}
		>
			{children}
		</div>
	);
}
