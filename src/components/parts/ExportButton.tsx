import { Download } from "lucide-react";
import { EXPORT_CSV_LABEL, EXPORT_CSV_TITLE } from "../../noTrans";

interface ExportButtonProps {
	onClick: () => void;
	disabled?: boolean;
}

/**
 * エクスポートボタンコンポーネント
 * アイコンとテキストを表示します
 */
export function ExportButton({ onClick, disabled }: ExportButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`
        flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200
        ${disabled ? "text-gray-400 cursor-not-allowed bg-gray-50 border-gray-100" : "text-green-600 hover:bg-green-50 active:bg-green-100 shadow-sm border border-gray-200 bg-white"}
      `}
			title={EXPORT_CSV_TITLE}
			aria-label={EXPORT_CSV_TITLE}
		>
			<Download size={18} aria-hidden="true" />
			<span className="text-sm font-medium">{EXPORT_CSV_LABEL}</span>
		</button>
	);
}
