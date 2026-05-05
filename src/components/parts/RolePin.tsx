import { X } from "lucide-react";

interface RolePinProps {
	name: string;
	onDelete?: () => void;
}

/**
 * 個別の役職をピン形式で表示する最小単位のコンポーネント
 */
export function RolePin({ name, onDelete }: RolePinProps) {
	return (
		<div
			data-role-name={name}
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
					<X size={12} aria-hidden="true" />
				</button>
			)}
		</div>
	);
}
