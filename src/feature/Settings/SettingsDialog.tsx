import { BigSettingSelection } from "@/components/blocks/BigSettingSelection";
import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";
import { SidebarSettingsSection } from "../../components/parts/SidebarSettingsSection";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../../components/ui/dialog";
import { Separator } from "../../components/ui/separator";
import { useStore } from "../../useStore";
import { MockPlayerSettingsSection } from "./MockPlayerSettingsSection";

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
				<DialogTitle className={TYPOGRAPHY.SIDEBAR}>{title}</DialogTitle>
			</DialogHeader>
			<div className="grid gap-4 py-2">
				<BigSettingSelection title={translationMetaData.LEFT_SIDEBAR_SETTING}>
					<SidebarSettingsSection
						setting={appSetting.leftSidebar}
						onUpdate={(leftSidebar) => updateAppSetting({ leftSidebar })}
					/>
				</BigSettingSelection>
				<Separator />
				<BigSettingSelection title={translationMetaData.RIGHT_SIDEBAR_SETTING}>
					<SidebarSettingsSection
						setting={appSetting.rightSidebar}
						onUpdate={(rightSidebar) => updateAppSetting({ rightSidebar })}
					/>
				</BigSettingSelection>
				<Separator />
				<BigSettingSelection
					title={translationMetaData.SIMULATE_SETTING_PLAYER_NAME}
				>
					<MockPlayerSettingsSection
						mockPlayerNames={appSetting.mockPlayerNames}
						onUpdate={(mockPlayerNames) =>
							updateAppSetting({ mockPlayerNames })
						}
					/>
				</BigSettingSelection>
			</div>
		</DialogContent>
	);
}
