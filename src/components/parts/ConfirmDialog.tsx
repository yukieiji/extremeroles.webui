import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{message}</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button variant="outline" onClick={onCancel}>
					{translationMetaData.Cancel}
				</Button>
				<Button onClick={onConfirm}>{translationMetaData.OK}</Button>
			</DialogFooter>
		</DialogContent>
	);
}
