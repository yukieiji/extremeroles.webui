import {
	format,
	OPTION_SIDEBAR_ARIA,
	SIDEBAR_CLOSE_ARIA,
	SIDEBAR_OPEN_ARIA,
} from "../../noTrans";

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
			aria-label={
				isOpen
					? format(SIDEBAR_CLOSE_ARIA, OPTION_SIDEBAR_ARIA)
					: format(SIDEBAR_OPEN_ARIA, OPTION_SIDEBAR_ARIA)
			}
		>
			{isOpen ? "◀" : "▶"}
		</button>
	);
}
