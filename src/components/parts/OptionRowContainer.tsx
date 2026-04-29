import type { ReactNode } from "react";

interface OptionRowContainerProps {
	leading: ReactNode;
	content: ReactNode;
	className?: string;
}

/**
 * オプション行のレイアウトを統一するためのコンテナ
 * 左側の操作領域（トグル等）と右側の表示・設定領域を管理します
 */
export function OptionRowContainer({
	leading,
	content,
	className = "",
}: OptionRowContainerProps) {
	return (
		<div
			className={`flex items-stretch bg-gray-900/50 hover:bg-gray-800/50 transition-colors border-b border-gray-800 last:border-0 ${className}`}
		>
			{/* 左側領域（トグルボタンやスペーサー） */}
			<div className="flex items-center justify-center w-10 shrink-0 border-r border-gray-800/50">
				{leading}
			</div>

			{/* 右側領域（OptionItem を含む内容） */}
			<div className="flex-1 min-w-0">{content}</div>
		</div>
	);
}
