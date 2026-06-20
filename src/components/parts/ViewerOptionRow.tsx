import type { ReactNode } from "react";
import { TYPOGRAPHY } from "@/designConstants";
import { calculateIndentation } from "@/logics/optionUtils";
import { VIEWER_ROW_TITLE } from "@/noTrans";

interface ViewerOptionRowProps {
	title: ReactNode;
	value: ReactNode;
	onDoubleClick: () => void;
	depth?: number;
	indentMultiplier?: number;
}

/**
 * 閲覧モード用のコンパクトな設定項目行
 */
export function ViewerOptionRow({
	title,
	value,
	onDoubleClick,
	depth = 0,
	indentMultiplier = 0.5,
	...props
}: ViewerOptionRowProps &
	Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title" | "value">) {
	const paddingLeft = calculateIndentation(depth, indentMultiplier, 0.5);

	return (
		<button
			type="button"
			onDoubleClick={onDoubleClick}
			{...props}
			className="w-full flex justify-between items-center hover:bg-component-hover rounded cursor-pointer select-none group py-1"
			style={{ paddingLeft }}
			title={VIEWER_ROW_TITLE}
		>
			<span
				className={`${TYPOGRAPHY.CHILD_LABEL} text-text-primary flex-1 text-left transition-colors`}
			>
				{title}
			</span>
			<div className="flex items-center shrink-0">
				<div
					className={`${TYPOGRAPHY.SMALL} text-text-primary text-right px-2`}
				>
					{value}
				</div>
			</div>
		</button>
	);
}
