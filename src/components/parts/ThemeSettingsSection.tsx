import { RadioGroup } from "../ui/radio-group";
import { LabeledRadioGroupItem } from "./LabeledRadioGroupItem";

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
			value={theme}
			onValueChange={(value) => onUpdate(value as "light" | "dark" | "system")}
			className="flex flex-row gap-6 mt-1"
		>
			<LabeledRadioGroupItem value="system" label="システム" />
			<LabeledRadioGroupItem value="light" label="ライト" />
			<LabeledRadioGroupItem value="dark" label="ダーク" />
		</RadioGroup>
	);
}
