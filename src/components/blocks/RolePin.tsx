import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";
import { ColoredText } from "../parts/ColoredText";
import { Badge } from "../ui/badge";

interface RolePinProps {
	name: string;
	onDelete: () => void;
}

/**
 * 個別の役職をピン形式で表示する最小単位のコンポーネント
 */
export function RolePin({ name, onDelete }: RolePinProps) {
	const transLatedName = translationMetaData[name] ?? name;

	return (
		<Badge className={TYPOGRAPHY.CHILD_LABEL} data-testid="role-pin">
			<ColoredText text={transLatedName} />
			<Button
				onClick={(e) => {
					e.stopPropagation();
					onDelete();
				}}
			>
				<X data-icon="inline-end" />
			</Button>
		</Badge>
	);
}
