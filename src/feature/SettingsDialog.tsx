import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
import { useStore } from "../useStore";

interface SettingsDialogProps {
	title: string;
}

/**
 * 設定ダイアログのコンテンツコンポーネント
 */
export function SettingsDialog({ title }: SettingsDialogProps) {
	const appSetting = useStore((state) => state.appSetting);
	const updateAppSetting = useStore((state) => state.updateAppSetting);

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
			</DialogHeader>
			<div className="grid gap-6 py-4">
				{/* 左サイドバー設定 */}
				<div className="grid gap-4">
					<h3 className={TYPOGRAPHY.SMALL_BOLD}>
						{translationMetaData.LEFT_SIDEBAR_SETTING}
					</h3>
					<div className="flex items-center justify-between">
						<Label className={TYPOGRAPHY.SMALL}>
							{translationMetaData.INITIAL_OPEN_STATE}
						</Label>
						<Select
							value={appSetting.leftSidebar.initialOpen ? "open" : "close"}
							onValueChange={(value) =>
								updateAppSetting({
									leftSidebar: {
										...appSetting.leftSidebar,
										initialOpen: value === "open",
									},
								})
							}
						>
							<SelectTrigger className="w-[120px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="open">
									{translationMetaData.OPEN_LABEL}
								</SelectItem>
								<SelectItem value="close">
									{translationMetaData.CLOSE_LABEL}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center justify-between">
						<Label className={TYPOGRAPHY.SMALL}>
							{translationMetaData.SAVE_STATE_TO_BROWSER}
						</Label>
						<Switch
							checked={appSetting.leftSidebar.saveState}
							onCheckedChange={(checked) =>
								updateAppSetting({
									leftSidebar: {
										...appSetting.leftSidebar,
										saveState: checked,
									},
								})
							}
						/>
					</div>
				</div>

				<Separator />

				{/* 右サイドバー設定 */}
				<div className="grid gap-4">
					<h3 className={TYPOGRAPHY.SMALL_BOLD}>
						{translationMetaData.RIGHT_SIDEBAR_SETTING}
					</h3>
					<div className="flex items-center justify-between">
						<Label className={TYPOGRAPHY.SMALL}>
							{translationMetaData.INITIAL_OPEN_STATE}
						</Label>
						<Select
							value={appSetting.rightSidebar.initialOpen ? "open" : "close"}
							onValueChange={(value) =>
								updateAppSetting({
									rightSidebar: {
										...appSetting.rightSidebar,
										initialOpen: value === "open",
									},
								})
							}
						>
							<SelectTrigger className="w-[120px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="open">
									{translationMetaData.OPEN_LABEL}
								</SelectItem>
								<SelectItem value="close">
									{translationMetaData.CLOSE_LABEL}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center justify-between">
						<Label className={TYPOGRAPHY.SMALL}>
							{translationMetaData.SAVE_STATE_TO_BROWSER}
						</Label>
						<Switch
							checked={appSetting.rightSidebar.saveState}
							onCheckedChange={(checked) =>
								updateAppSetting({
									rightSidebar: {
										...appSetting.rightSidebar,
										saveState: checked,
									},
								})
							}
						/>
					</div>
				</div>
			</div>
		</DialogContent>
	);
}
