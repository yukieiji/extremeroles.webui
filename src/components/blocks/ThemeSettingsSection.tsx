import { LabeledRadioGroupItem } from "../parts/LabeledRadioGroupItem";
import { RadioGroup } from "../ui/radio-group";

interface ThemeSettingsSectionProps {
	theme: "light" | "dark" | "system";
	onUpdate: (theme: "light" | "dark" | "system") => void;
}

export function ThemeSettingsSection({
	theme,
	onUpdate,
}: ThemeSettingsSectionProps) {
	return (
		<RadioGroup
			defaultValue={theme}
			onValueChange={(value) => onUpdate(value as "light" | "dark" | "system")}
			className="flex flex-row gap-4 mt-1"
		>
			<LabeledRadioGroupItem value="system" label="システム" />
			<LabeledRadioGroupItem value="light" label="ライト" />
			<LabeledRadioGroupItem value="dark" label="ダーク" />
		</RadioGroup>
	);
}
