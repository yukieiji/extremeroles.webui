import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXPORT_CSV_LABEL, EXPORT_CSV_TITLE } from "@/noTrans";

interface ExportButtonProps {
	onClick: () => void;
	disabled?: boolean;
	className?: string;
}

/**
 * エクスポートボタンコンポーネント
 * アイコンとテキストを表示します
 */
export function ExportButton({
	onClick,
	disabled,
	className,
}: ExportButtonProps) {
	return (
		<Button
			onClick={onClick}
			disabled={disabled}
			title={EXPORT_CSV_TITLE}
			aria-label={EXPORT_CSV_TITLE}
			className={className}
		>
			<Download />
			{EXPORT_CSV_LABEL}
		</Button>
	);
}
