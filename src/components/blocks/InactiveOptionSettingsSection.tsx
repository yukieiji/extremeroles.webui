import type { InactiveOptionDisplayMode } from "@/logics/storageUtils";
import { LabeledRadioGroupItem } from "../parts/LabeledRadioGroupItem";
import { RadioGroup } from "../ui/radio-group";

interface InactiveOptionSettingsSectionProps {
	inactiveOptionDisplay: InactiveOptionDisplayMode;
	onUpdate: (mode: InactiveOptionDisplayMode) => void;
}

/**
 * 非アクティブオプション表示設定のコンポーネント（非表示/操作だけ無効/操作可能）
 */
export function InactiveOptionSettingsSection({
	inactiveOptionDisplay,
	onUpdate,
}: InactiveOptionSettingsSectionProps) {
	return (
		<RadioGroup
			value={inactiveOptionDisplay}
			onValueChange={(value) => onUpdate(value as InactiveOptionDisplayMode)}
			className="flex flex-row flex-wrap gap-4 mt-1"
		>
			<LabeledRadioGroupItem value="hidden" label="非表示" />
			<LabeledRadioGroupItem value="disabled" label="操作だけ無効" />
			<LabeledRadioGroupItem value="enabled" label="操作可能" />
		</RadioGroup>
	);
}
