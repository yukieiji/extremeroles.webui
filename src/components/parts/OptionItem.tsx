import type { ReactNode } from "react";

interface OptionItemProps {
	children: ReactNode;
	className?: string;
}

/**
 * オプション項目を表示するためのコンテナコンポーネント
 */
export function OptionItem({
	children,
	className = "",
	id,
}: OptionItemProps & { id?: string }) {
	return (
		<div
			id={id}
			className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 ${className}`}
		>
			{children}
		</div>
	);
}
