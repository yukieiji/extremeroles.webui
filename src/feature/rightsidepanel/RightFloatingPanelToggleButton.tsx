import { PANEL_CLOSE_ARIA, PANEL_OPEN_ARIA } from "../../noTrans";

interface RightFloatingPanelToggleButtonProp {
	isOpen: boolean;
	onClick: () => void;
}

export function RightFloatingPanelToggleButton({
	isOpen,
	onClick,
}: RightFloatingPanelToggleButtonProp) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="h-full w-6 bg-blue-600 text-white shadow-mdhover:bg-blue-700 flex items-center justify-center cursor-pointer"
			aria-label={isOpen ? PANEL_CLOSE_ARIA : PANEL_OPEN_ARIA}
		>
			<span className="text-sm font-bold">{isOpen ? "▶" : "◀"}</span>
		</button>
	);
}
