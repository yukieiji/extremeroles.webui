import type { ReactNode } from "react";

interface HighlightWrapperProps {
	isHighlighted: boolean;
	children: ReactNode;
	id?: string;
	className?: string;
	"data-testid"?: string;
}

/**
 * ハイライト状態を表示するためのラッパーコンポーネント
 */
export function HighlightWrapper({
	isHighlighted,
	children,
	id,
	className = "",
	"data-testid": testId,
}: HighlightWrapperProps) {
	return (
		<div
			id={id}
			data-testid={testId}
			className={`transition-all duration-500 rounded ${
				isHighlighted ? "ring-2 ring-blue-500 bg-blue-500/10" : ""
			} ${className}`}
		>
			{children}
		</div>
	);
}
