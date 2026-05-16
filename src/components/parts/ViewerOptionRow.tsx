import type { ReactNode } from "react";
import { VIEWER_ROW_TITLE } from "@/noTrans";

interface ViewerOptionRowProps {
	title: ReactNode;
	value: ReactNode;
	onDoubleClick: () => void;
	depth?: number;
}

/**
 * 閲覧モード用のコンパクトな設定項目行
 */
export function ViewerOptionRow({
	title,
	value,
	onDoubleClick,
	depth = 0,
}: ViewerOptionRowProps) {
	const paddingLeft = depth > 0 ? `${depth * 0.5}rem` : "0";

	return (
		<button
			type="button"
			onDoubleClick={onDoubleClick}
			className="w-full flex justify-between items-center py-1 pr-2 hover:bg-gray-700/50 rounded cursor-pointer select-none gap-2 group"
			style={{ paddingLeft: `calc(0.5rem + ${paddingLeft})` }}
			title={VIEWER_ROW_TITLE}
		>
			<span className="text-sm text-gray-300 flex-1 text-left group-hover:text-white transition-colors">
				{title}
			</span>
			<div className="flex items-center gap-1 shrink-0">
				<div className="text-sm text-blue-400 font-medium text-right">
					{value}
				</div>
			</div>
		</button>
	);
}
