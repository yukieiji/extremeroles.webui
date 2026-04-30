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
		<button
			type="button"
			onClick={onClick}
			className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
			aria-label={isOpen ? SIDEBAR_CLOSE_ARIA : SIDEBAR_OPEN_ARIA}
		>
			{isOpen ? "◀" : "▶"}
		</button>
	);
}
