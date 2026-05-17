import { ChevronLeft, ChevronRight } from "lucide-react";
import { PANEL_CLOSE_ARIA, PANEL_OPEN_ARIA } from "@/noTrans";

interface RightSidePanelToggleButtonProps {
	isOpen: boolean;
	onClick: () => void;
}

export function RightSidePanelToggleButton({
	isOpen,
	onClick,
}: RightSidePanelToggleButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="h-full w-6 bg-blue-600 text-white shadow-md hover:bg-blue-700 flex items-center justify-center cursor-pointer transition-colors"
			aria-label={isOpen ? PANEL_CLOSE_ARIA : PANEL_OPEN_ARIA}
			data-testid="right-panel-toggle"
		>
			{isOpen ? <ChevronRight /> : <ChevronLeft />}
		</button>
	);
}
