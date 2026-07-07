import { useId } from "react";
import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";
import type { SidebarSetting } from "@/logics/storageUtils";
import { Label } from "../components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
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
		<div className="grid gap-2">
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
			<div className="flex items-center justify-between">
				<Label htmlFor={initialStateId} className={TYPOGRAPHY.SMALL}>
					{translationMetaData.INITIAL_SIDEBAR_STATE}
				</Label>
				<Select
					id={initialStateId}
					disabled={setting.saveState}
					value={
						setting.initialOpen
							? translationMetaData.SIDEBAR_OPEN_LABEL
							: translationMetaData.SIDEBAR_CLOSE_LABEL
					}
					onValueChange={(value) =>
						onUpdate({
							...setting,
							initialOpen: value === "open",
						})
					}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="open">
								{translationMetaData.SIDEBAR_OPEN_LABEL}
							</SelectItem>
							<SelectItem value="close">
								{translationMetaData.SIDEBAR_CLOSE_LABEL}
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
