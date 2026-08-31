import { DropdownSettingSection } from "@/components/blocks/DropdownSettingSection";
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
			title="表示モード"
			value={inactiveOptionDisplay}
			onUpdate={(value) => {
				if (value) {
					onUpdate(value as InactiveOptionDisplayMode);
				}
			}}
			select={[
				{ value: "hidden", title: "非表示" },
				{ value: "disabled", title: "操作だけ無効" },
				{ value: "enabled", title: "操作可能" },
			]}
		/>
	);
}
