import { RefreshCw } from "lucide-react";
import { SYNC_BUTTON_ARIA, SYNC_BUTTON_TITLE } from "../../noTrans";

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
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`
        p-2 rounded-full transition-all duration-200
        ${disabled ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50 active:bg-blue-100 shadow-sm border border-gray-200 bg-white"}
      `}
			title={SYNC_BUTTON_TITLE}
			aria-label={SYNC_BUTTON_ARIA}
		>
			<RefreshCw size={20} aria-hidden="true" />
		</button>
	);
}
