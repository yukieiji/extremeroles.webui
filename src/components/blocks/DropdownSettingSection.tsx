import { useId } from "react";
import { TYPOGRAPHY } from "@/designConstants";
import { Label } from "../../components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../components/ui/select";
import { SettingSectionLayout } from "../parts/SettingSectionLayout";

interface SelectItemProp<T> {
	value: T;
	title: string;
}

interface DropdownSettingSectionProp<T> {
	title: string;
	value: T;
	select: SelectItemProp<T>[];
	onUpdate: (value: T | null) => void;
	disabled?: boolean;
}

export function DropdownSettingSection<T>({
	value,
	title,
	onUpdate,
	select,
	disabled = false,
}: DropdownSettingSectionProp<T>) {
	const id = useId();

	return (
		<SettingSectionLayout>
			<Label htmlFor={id} className={TYPOGRAPHY.SMALL}>
				{title}
			</Label>
			<Select
				id={id}
				disabled={disabled}
				value={value}
				onValueChange={onUpdate}
			>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{select.map((x) => {
							return (
								<SelectItem key={x.title} value={x.value}>
									{x.title}
								</SelectItem>
							);
						})}
					</SelectGroup>
				</SelectContent>
			</Select>
		</SettingSectionLayout>
	);
}
