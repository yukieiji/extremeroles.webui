import { useId } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface ThemeSettingsItemProps {
	value: "light" | "dark" | "system";
	label: string;
}

/**
 * 各テーマの選択アイテムを表すサブコンポーネント
 */
function ThemeSettingsItem({ value, label }: ThemeSettingsItemProps) {
	const id = useId();
	return (
		<div className="flex items-center gap-2">
			<RadioGroupItem value={value} id={id} />
			<Label
				htmlFor={id}
				className="cursor-pointer font-medium text-sm text-text-primary"
			>
				{label}
			</Label>
		</div>
	);
}

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
			<ThemeSettingsItem value="system" label="システム" />
			<ThemeSettingsItem value="light" label="ライト" />
			<ThemeSettingsItem value="dark" label="ダーク" />
		</RadioGroup>
	);
}
