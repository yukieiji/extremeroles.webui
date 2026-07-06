import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";
import type { SidebarSetting } from "@/logics/storageUtils";
import { Label } from "../components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";

interface SidebarSettingsSectionProps {
	idPrefix: string;
	title: string;
	setting: SidebarSetting;
	onUpdate: (setting: SidebarSetting) => void;
}

/**
 * サイドバーの設定セクションコンポーネント
 */
export function SidebarSettingsSection({
	idPrefix,
	title,
	setting,
	onUpdate,
}: SidebarSettingsSectionProps) {
	return (
		<div className="grid gap-4">
			<h3 className={TYPOGRAPHY.SMALL_BOLD}>{title}</h3>
			<div className="flex items-center justify-between">
				<Label htmlFor={`${idPrefix}-initial-state`} className={TYPOGRAPHY.SMALL}>
					{translationMetaData.INITIAL_OPEN_STATE}
				</Label>
				<Select
					id={`${idPrefix}-initial-state`}
					disabled={setting.saveState}
					value={setting.initialOpen ? "open" : "close"}
					onValueChange={(value) =>
						onUpdate({
							...setting,
							initialOpen: value === "open",
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
				<Label htmlFor={`${idPrefix}-save-state`} className={TYPOGRAPHY.SMALL}>
					{translationMetaData.SAVE_STATE_TO_BROWSER}
				</Label>
				<Switch
					id={`${idPrefix}-save-state`}
					checked={setting.saveState}
					onCheckedChange={(checked) =>
						onUpdate({
							...setting,
							saveState: checked,
						})
					}
				/>
			</div>
		</div>
	);
}
