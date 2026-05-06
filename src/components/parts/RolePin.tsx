import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RolePinProps {
	name: string;
	onDelete?: () => void;
}

/**
 * 個別の役職をピン形式で表示する最小単位のコンポーネント
 */
export function RolePin({ name, onDelete }: RolePinProps) {
	return (
		<div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
			<span>{name}</span>
			{onDelete && (
				<Button
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
					aria-label={`Remove ${name}`}
				>
					<X size={12} aria-hidden="true" />
				</Button>
			)}
		</div>
	);
}
