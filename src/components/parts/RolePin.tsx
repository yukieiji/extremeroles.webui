import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

interface RolePinProps {
	name: string;
	onDelete?: () => void;
}

/**
 * 個別の役職をピン形式で表示する最小単位のコンポーネント
 */
export function RolePin({ name, onDelete }: RolePinProps) {
	return (
		<Badge className="pr-0! gap-0 hover:bg-primary-action! *:cursor-default">
			<span className="pl-2 pr-1.5">{name}</span>
			{onDelete && (
				<Button
					variant="ghost"
					className="size-5 p-0 hover:bg-primary-action-hover! hover:text-text-primary rounded-none"
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
					aria-label={`Remove ${name}`}
				>
					<X size={12} />
				</Button>
			)}
		</Badge>
	);
}
