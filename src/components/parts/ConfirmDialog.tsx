import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { CANCEL } from "@/noTrans";

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
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{message}</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button variant="outline" onClick={onCancel}>
					{CANCEL}
				</Button>
				<Button onClick={onConfirm}>OK</Button>
			</DialogFooter>
		</DialogContent>
	);
}
