import { Search } from "lucide-react";

interface RoleSearchInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

/**
 * 役職検索用の入力フィールド
 */
export function RoleSearchInput({
	value,
	onChange,
	placeholder,
}: RoleSearchInputProps) {
	return (
		<div className="relative">
			<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
				<Search size={20} aria-hidden="true" />
			</span>
			<input
				type="text"
				className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}
