import type { ReactNode } from "react";
import { calculateIndentation } from "@/logics/optionUtils";

interface OptionRowContainerProps {
	leading: ReactNode;
	content: ReactNode;
	className?: string;
	depth?: number;
	indentMultiplier?: number;
}

/**
 * オプション行のレイアウトを統一するためのコンテナ
 * 左側の操作領域（トグル等）と右側の表示・設定領域を管理します
 */
export function OptionRowContainer({
	leading,
	content,
	className = "",
	depth = 0,
	indentMultiplier = 1,
}: OptionRowContainerProps) {
	const paddingLeft = calculateIndentation(depth, indentMultiplier, 0.375);

	return (
		<div className="hover:bg-component-hover transition-colors">
			<div
				className={`flex items-stretch ${className}`}
				style={{ paddingLeft }}
			>
				{/* 左側領域（トグルボタンやスペーサー） */}
				<div className="flex items-center justify-center w-10 shrink-0">
					{leading}
				</div>

				{/* 右側領域（OptionItem を含む内容） */}
				<div className="flex-1 min-w-0">{content}</div>
			</div>
		</div>
	);
}
