import { useId } from "react";
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
	setting: SidebarSetting;
	onUpdate: (setting: SidebarSetting) => void;
}

/**
 * サイドバーの設定セクション（開閉初期値と保存設定）
 */
export function SidebarSettingsSection({
	setting,
	onUpdate,
}: SidebarSettingsSectionProps) {
	const initialStateId = useId();
	const saveStateId = useId();

	return (
		<div className="grid gap-4">
			<div className="flex items-center justify-between">
				<Label htmlFor={initialStateId} className={TYPOGRAPHY.SMALL}>
					{translationMetaData.INITIAL_OPEN_STATE}
				</Label>
				<Select
					disabled={setting.saveState}
					value={setting.initialOpen ? "open" : "close"}
					onValueChange={(value) =>
						onUpdate({
							...setting,
							initialOpen: value === "open",
						})
					}
				>
					<SelectTrigger id={initialStateId} className="w-[120px]">
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
				<Label htmlFor={saveStateId} className={TYPOGRAPHY.SMALL}>
					{translationMetaData.SAVE_STATE_TO_BROWSER}
				</Label>
				<Switch
					id={saveStateId}
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
