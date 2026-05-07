import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";

interface SettingsDialogProps {
	title: string;
}

/**
 * 設定ダイアログのコンテンツコンポーネント
 */
export function SettingsDialog({ title }: SettingsDialogProps) {
	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
			</DialogHeader>
			<div className="grid gap-4 py-4">
				<p className="text-sm text-gray-500">設定項目は現在準備中です。</p>
			</div>
		</DialogContent>
	);
}
