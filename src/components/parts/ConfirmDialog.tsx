import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";

interface ConfirmDialogProps {
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

/**
 * 確認ダイアログコンポーネント
 */
export function ConfirmDialog({
	title,
	message,
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	return (
		<DialogContent className="sm:max-w-md">
			<DialogHeader>
				<DialogTitle className={TYPOGRAPHY.LABEL}>{title}</DialogTitle>
				<DialogDescription className={TYPOGRAPHY.LABEL}>
					{message}
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button
					variant="outline"
					onClick={onCancel}
					className={TYPOGRAPHY.LABEL}
				>
					{translationMetaData.Cancel}
				</Button>
				<Button onClick={onConfirm} className={TYPOGRAPHY.LABEL}>
					{translationMetaData.OK}
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}
