interface RolePinProps {
	id: number;
	name: string;
	onDelete?: () => void;
}

/**
 * 個別の役職をピン形式で表示する最小単位のコンポーネント
 */
export function RolePin({ id, name, onDelete }: RolePinProps) {
	return (
		<div
			data-role-id={id}
			className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
		>
			<span>{name}</span>
			{onDelete && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
					className="hover:text-blue-600 focus:outline-none"
					aria-label={`Remove ${name}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-3 w-3"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						role="img"
						aria-label="Remove icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			)}
		</div>
	);
}
