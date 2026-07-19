import { useId } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface ThemeSettingsSectionProps {
	theme: "light" | "dark" | "system";
	onUpdate: (theme: "light" | "dark" | "system") => void;
}

export function ThemeSettingsSection({
	theme,
	onUpdate,
}: ThemeSettingsSectionProps) {
	const systemId = useId();
	const lightId = useId();
	const darkId = useId();

	return (
		<RadioGroup
			value={theme}
			onValueChange={(value) => onUpdate(value as "light" | "dark" | "system")}
			className="flex flex-row gap-6 mt-1"
		>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="system" id={systemId} />
				<Label
					htmlFor={systemId}
					className="cursor-pointer font-medium text-sm text-text-primary"
				>
					システム
				</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="light" id={lightId} />
				<Label
					htmlFor={lightId}
					className="cursor-pointer font-medium text-sm text-text-primary"
				>
					ライト
				</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="dark" id={darkId} />
				<Label
					htmlFor={darkId}
					className="cursor-pointer font-medium text-sm text-text-primary"
				>
					ダーク
				</Label>
			</div>
		</RadioGroup>
	);
}
