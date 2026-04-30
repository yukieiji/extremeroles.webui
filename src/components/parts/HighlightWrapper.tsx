import type { ReactNode } from "react";

interface HighlightWrapperProps {
	isHighlighted: boolean;
	children: ReactNode;
	id?: string;
	isInset: boolean;
}

/**
 * ハイライト状態を表示するためのラッパーコンポーネント
 */
export function HighlightWrapper({
	isHighlighted,
	children,
	id,
	isInset,
}: HighlightWrapperProps) {
	const highlightClass = isHighlighted
		? `ring-2 ring-blue-500 ${isInset ? "ring-inset" : ""}`
		: "";

	return (
		<div
			id={id}
			className={`transition-all duration-500 rounded ${highlightClass}`}
		>
			{children}
		</div>
	);
}
