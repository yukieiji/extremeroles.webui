import { NativeSelect, NativeSelectOption } from "../ui/native-select";

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
	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newValue = parseInt(e.target.value, 10);
		onChange(newValue);
	};

	return (
		<NativeSelect value={selection} onChange={handleSelectChange}>
			{values.map((value, index) => {
				return (
					<NativeSelectOption key={value} value={index}>
						{value}
					</NativeSelectOption>
				);
			})}
		</NativeSelect>
	);
}
