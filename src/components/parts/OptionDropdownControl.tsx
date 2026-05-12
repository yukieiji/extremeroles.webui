import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface OptionDropdownControlProps {
	selection: number;
	values: string[];
	onChange: (selection: number) => void;
}

/**
 * 文字列オプション（String）用のドロップダウンコンポーネント
 */
export function OptionDropdownControl({
	selection,
	values,
	onChange,
}: OptionDropdownControlProps) {
	const handleValueChange = (value: string | null) => {
		const index = values.indexOf(value ?? "");
		if (index !== -1) {
			onChange(index);
		}
	};

	return (
		<Select value={values[selection]} onValueChange={handleValueChange}>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent alignItemWithTrigger={false}>
				{values.map((value) => (
					<SelectItem key={value} value={value}>
						{value}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
