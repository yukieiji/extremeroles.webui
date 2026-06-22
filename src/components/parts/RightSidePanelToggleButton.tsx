import { ChevronLeft, ChevronRight } from "lucide-react";
import { DEFAULT_PRIMARY_BUTTUN_COLORS } from "@/designConstants";
import { cn } from "@/lib/utils";
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
			className={cn(
				"h-full w-6 shadow-md flex items-center justify-center cursor-pointer transition-colors",
				DEFAULT_PRIMARY_BUTTUN_COLORS,
			)}
			data-testid="right-panel-toggle"
		>
			{isOpen ? <ChevronRight /> : <ChevronLeft />}
		</button>
	);
}
