import { DropdownSettingSection } from "@/components/blocks/DropdownSettingSection";
import { SwitchSettingSection } from "@/components/blocks/SwitchSettingSection";
import { translationMetaData } from "@/logics/api";
import type { SidebarSetting } from "@/logics/storageUtils";

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
	return (
		<div className="grid gap-2">
			<SwitchSettingSection
				title={translationMetaData.SAVE_STATE_TO_BROWSER}
				checked={setting.saveState}
				onUpdate={(checked) =>
					onUpdate({
						...setting,
						saveState: checked,
					})
				}
			/>
			<DropdownSettingSection
				title={translationMetaData.INITIAL_SIDEBAR_STATE}
				disabled={setting.saveState}
				value={
					setting.initialOpen
						? translationMetaData.SIDEBAR_OPEN_LABEL
						: translationMetaData.SIDEBAR_CLOSE_LABEL
				}
				onUpdate={(value) =>
					onUpdate({
						...setting,
						initialOpen: value === "open",
					})
				}
				select={[
					{
						value: "open",
						title: translationMetaData.SIDEBAR_OPEN_LABEL,
					},
					{
						value: "close",
						title: translationMetaData.SIDEBAR_CLOSE_LABEL,
					},
				]}
			/>
		</div>
	);
}
