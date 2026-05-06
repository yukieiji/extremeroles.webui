import { Button } from "@/components/ui/button";
import { SIDEBAR_CLOSE_ARIA, SIDEBAR_OPEN_ARIA } from "../../noTrans";

interface OptionGroupToggleSidebarToggleButtonProps {
	onClick: () => void;
	isOpen: boolean;
}

/**
 * サイドバーの開閉を切り替えるボタン
 */
export function OptionGroupToggleSidebarToggleButton({
	onClick,
	isOpen,
}: OptionGroupToggleSidebarToggleButtonProps) {
	return (
		<Button
			variant="secondary"
			size="icon"
			onClick={onClick}
			className="h-8 w-8"
			aria-label={isOpen ? SIDEBAR_CLOSE_ARIA : SIDEBAR_OPEN_ARIA}
		>
			{isOpen ? "◀" : "▶"}
		</Button>
	);
}
