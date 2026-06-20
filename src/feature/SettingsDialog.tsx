import { TYPOGRAPHY } from "@/designConstants";
import { SETTINGS_UNDER_PREPARATION } from "@/noTrans";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../components/ui/dialog";

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
			<div className="grid">
				<p className={`${TYPOGRAPHY.SMALL} text-text-secondary`}>
					{SETTINGS_UNDER_PREPARATION}
				</p>
			</div>
		</DialogContent>
	);
}
