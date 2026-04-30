import type { ReactNode } from "react";

interface HighlightWrapperProps {
	isHighlighted: boolean;
	children: ReactNode;
	id?: string;
	"data-testid"?: string;
}

/**
 * ハイライト状態を表示するためのラッパーコンポーネント
 */
export function HighlightWrapper({
	isHighlighted,
	children,
	id,
	"data-testid": testId,
}: HighlightWrapperProps) {
	return (
		<div
			id={id}
			data-testid={testId}
			className={`transition-all duration-500 rounded ${
				isHighlighted ? "outline-2 outline-blue-500" : ""
			}`}
		>
			{children}
		</div>
	);
}
