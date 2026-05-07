import { Search } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@/components/ui/input-group";

interface RoleSearchInputProps {
	onChange: (value: string) => void;
	placeholder?: string;
}

/**
 * 役職検索用の入力フィールド
 */
export function RoleSearchInput({
	onChange,
	placeholder,
}: RoleSearchInputProps) {
	return (
		<InputGroup>
			<InputGroupInput
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
			/>
			<InputGroupAddon align="inline-start">
				<Search size={20} aria-hidden="true" />
			</InputGroupAddon>
			<InputGroupAddon>
				<InputGroupText />
			</InputGroupAddon>
		</InputGroup>
	);
}
