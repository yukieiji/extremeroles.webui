import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SYNC_BUTTON_ARIA, SYNC_BUTTON_TITLE } from "@/noTrans";

interface SyncButtonProps {
	onClick: () => void;
	disabled?: boolean;
	className?: string;
}

/**
 * 同期ボタンコンポーネント
 * アイコンのみを表示します
 */
export function SyncButton({ onClick, disabled, className }: SyncButtonProps) {
	return (
		<Button
			onClick={onClick}
			disabled={disabled}
			title={SYNC_BUTTON_TITLE}
			aria-label={SYNC_BUTTON_ARIA}
			className={className}
		>
			<RefreshCw size={20} aria-hidden="true" />
		</Button>
	);
}
