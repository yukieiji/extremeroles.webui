import { DropdownSettingSection } from "@/components/blocks/DropdownSettingSection";
import { translationMetaData } from "@/logics/api";
import type { InactiveOptionDisplayMode } from "@/logics/storageUtils";

interface InactiveOptionSettingsSectionProps {
	inactiveOptionDisplay: InactiveOptionDisplayMode;
	onUpdate: (mode: InactiveOptionDisplayMode) => void;
}

/**
 * 非アクティブオプション表示設定のコンポーネント（ドロップダウン形式）
 */
export function InactiveOptionSettingsSection({
	inactiveOptionDisplay,
	onUpdate,
}: InactiveOptionSettingsSectionProps) {
	return (
		<DropdownSettingSection
			title={translationMetaData.DISPLAY_MODE}
			value={inactiveOptionDisplay}
			onUpdate={(value) => {
				if (value) {
					onUpdate(value as InactiveOptionDisplayMode);
				}
			}}
			select={[
				{ value: "hidden", title: translationMetaData.DISPLAY_MODE_HIDDEN },
				{ value: "disabled", title: translationMetaData.DISPLAY_MODE_DISABLED },
				{ value: "enabled", title: translationMetaData.DISPLAY_MODE_ENABLED },
			]}
		/>
	);
}
