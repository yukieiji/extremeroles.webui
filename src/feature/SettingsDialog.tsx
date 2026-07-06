import { translationMetaData } from "@/logics/api";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../components/ui/dialog";
import { Separator } from "../components/ui/separator";
import { useStore } from "../useStore";
import { SidebarSettingsSection } from "./SidebarSettingsSection";

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
				<div className="grid gap-4">
					<h3 className="text-xs font-bold">
						{translationMetaData.LEFT_SIDEBAR_SETTING}
					</h3>
					<SidebarSettingsSection
						setting={appSetting.leftSidebar}
						onUpdate={(leftSidebar) => updateAppSetting({ leftSidebar })}
					/>
				</div>

				<Separator />

				<div className="grid gap-4">
					<h3 className="text-xs font-bold">
						{translationMetaData.RIGHT_SIDEBAR_SETTING}
					</h3>
					<SidebarSettingsSection
						setting={appSetting.rightSidebar}
						onUpdate={(rightSidebar) => updateAppSetting({ rightSidebar })}
					/>
				</div>
			</div>
		</DialogContent>
	);
}
