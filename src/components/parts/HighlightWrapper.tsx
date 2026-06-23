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
		? isInset
			? "inset-ring-2 inset-ring-search-highlight"
			: "ring-2 ring-search-highlight"
		: "";

	return (
		<div
			id={id}
			data-highlighted={isHighlighted ? "true" : "false"}
			className={`transition-all duration-2000 rounded ${highlightClass}`}
		>
			{children}
		</div>
	);
}
