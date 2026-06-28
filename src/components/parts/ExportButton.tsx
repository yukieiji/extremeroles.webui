import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";

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
		<Button onClick={onClick} disabled={disabled} className={TYPOGRAPHY.LABEL}>
			<Download />
			{translationMetaData.exportCsv}
		</Button>
	);
}
