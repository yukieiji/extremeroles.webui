import type { ReactNode } from "react";

interface HighlightWrapperProps {
	id: string;
	isHighlighted: boolean;
	children: ReactNode;
	isInset: boolean;
}

/**
 * ハイライト状態を表示するためのラッパーコンポーネント
 */
export function HighlightWrapper({
	id,
	isHighlighted,
	children,
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
