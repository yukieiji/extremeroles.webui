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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					role="img"
					aria-label="Search icon"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
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
