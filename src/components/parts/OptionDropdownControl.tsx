import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface OptionDropdownControlProps {
	selection: string;
	values: string[];
	onChange: (selection: string) => void;
	disabled?: boolean;
}

/**
 * 文字列オプション（String）用のドロップダウンコンポーネント
 */
export function OptionDropdownControl({
	selection,
	values,
	onChange,
	disabled = false,
}: OptionDropdownControlProps) {
	const handleValueChange = (value: string | null) => {
		if (value !== null) {
			onChange(value);
		}
	};

	return (
		<Select
			value={selection}
			onValueChange={handleValueChange}
			disabled={disabled}
		>
			<SelectTrigger className="w-full sm:w-48 mr-3">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{values.map((value) => (
					<SelectItem key={value} value={value}>
						{value}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
