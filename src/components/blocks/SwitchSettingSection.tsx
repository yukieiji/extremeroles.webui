import { useId } from "react";
import { TYPOGRAPHY } from "@/designConstants";
import { SettingSectionLayout } from "../parts/SettingSectionLayout";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface SwitchSettingSectionProp {
	title: string;
	checked: boolean;
	onUpdate: (value: boolean) => void;
	disabled?: boolean;
}

export function SwitchSettingSection({
	title,
	checked: isChecked,
	onUpdate,
}: SwitchSettingSectionProp) {
	const id = useId();

	return (
		<SettingSectionLayout>
			<Label htmlFor={id} className={TYPOGRAPHY.SMALL}>
				{title}
			</Label>
			<Switch id={id} checked={isChecked} onCheckedChange={onUpdate} />
		</SettingSectionLayout>
	);
}
