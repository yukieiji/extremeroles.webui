import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translationMetaData } from "@/logics/api";

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
			title={translationMetaData.SYNC_BUTTON_TITLE}
		>
			<RefreshCw size={20} aria-hidden="true" />
		</Button>
	);
}
