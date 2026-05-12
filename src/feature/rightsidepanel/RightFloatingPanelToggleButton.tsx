import { PANEL_CLOSE_ARIA, PANEL_OPEN_ARIA } from "@/noTrans";

interface RightFloatingPanelToggleButtonProps {
	isOpen: boolean;
	onClick: () => void;
}

export function RightFloatingPanelToggleButton({
	isOpen,
	onClick,
}: RightFloatingPanelToggleButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="fixed top-1/2 right-0 z-[60] -translate-y-1/2 w-8 h-8 bg-blue-600 text-white shadow-md hover:bg-blue-700 flex items-center justify-center cursor-pointer rounded-l-md transition-transform"
			aria-label={isOpen ? PANEL_CLOSE_ARIA : PANEL_OPEN_ARIA}
			data-testid="right-panel-toggle"
		>
			<span className="text-sm font-bold">{isOpen ? "▶" : "◀"}</span>
		</button>
	);
}
