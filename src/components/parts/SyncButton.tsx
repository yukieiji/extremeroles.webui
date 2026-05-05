import { RefreshCw } from "lucide-react";
import { SYNC_BUTTON_ARIA, SYNC_BUTTON_TITLE } from "../../noTrans";
import { Button } from "@/components/ui/button";

interface SyncButtonProps {
	onClick: () => void;
	disabled?: boolean;
}

/**
 * 同期ボタンコンポーネント
 * アイコンのみを表示します
 */
export function SyncButton({ onClick, disabled }: SyncButtonProps) {
	return (
		<Button
			onClick={onClick}
			disabled={disabled}
			title={SYNC_BUTTON_TITLE}
			aria-label={SYNC_BUTTON_ARIA}
			size="icon"
		>
			<RefreshCw size={20} aria-hidden="true" />
		</Button>
	);
}
