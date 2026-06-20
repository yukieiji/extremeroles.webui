import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TYPOGRAPHY } from "@/designConstants";
import { Badge } from "../ui/badge";

interface RolePinProps {
	name: string;
	onDelete: () => void;
}

/**
 * 個別の役職をピン形式で表示する最小単位のコンポーネント
 */
export function RolePin({ name, onDelete }: RolePinProps) {
	return (
		<Badge className={TYPOGRAPHY.CHILD_LABEL}>
			<span>{name}</span>
			<Button
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}
				aria-label={`Remove ${name}`}
			>
				<X data-icon="inline-end" />
			</Button>
		</Badge>
	);
}
