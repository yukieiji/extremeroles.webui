import type { ReactNode } from "react";

interface HighlightWrapperProps {
	isHighlighted: boolean;
	children: ReactNode;
	isInset: boolean;
	id?: string;
}

/**
 * ハイライト状態を表示するためのラッパーコンポーネント
 */
export function HighlightWrapper({
	isHighlighted,
	children,
	isInset,
	id,
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
