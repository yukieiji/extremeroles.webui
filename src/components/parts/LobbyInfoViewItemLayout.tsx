import { TYPOGRAPHY } from "@/designConstants";

interface LobbyInfoViewItemLayoutProps {
	title: string;
	children: React.ReactNode;
}

/**
 * ハイライト状態を表示するためのラッパーコンポーネント
 */
export function LobbyInfoViewItemLayout({
	title,
	children,
}: LobbyInfoViewItemLayoutProps) {
	return (
		<div className="flex flex-row gap-2 items-center">
			<span className={`${TYPOGRAPHY.SMALL} text-text-secondary w-28`}>
				{title}
			</span>
			{children}
		</div>
	);
}
