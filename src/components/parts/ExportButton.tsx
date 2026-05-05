import { Download } from "lucide-react";
import { EXPORT_CSV_LABEL, EXPORT_CSV_TITLE } from "../../noTrans";
import { Button } from "@/components/ui/button";

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
		<Button
			onClick={onClick}
			disabled={disabled}
			title={EXPORT_CSV_TITLE}
			aria-label={EXPORT_CSV_TITLE}
		>
			<Download size={18} aria-hidden="true" />
			{EXPORT_CSV_LABEL}
		</Button>
	);
}
