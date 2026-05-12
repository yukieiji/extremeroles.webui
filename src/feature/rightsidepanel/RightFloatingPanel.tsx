import { use } from "react";
import { cn } from "@/lib/utils";
import { getAllOptions } from "@/logics/api.store";
import { RIGHT_PANEL_ARIA } from "@/noTrans";
import { useStore } from "@/useStore";
import { RightFloatingPanelBody } from "./RightFloatingPanelBody";
import { RightFloatingPanelToggleButton } from "./RightFloatingPanelToggleButton";
import { RightPanelFloatingPanelResizeHandle } from "./RightPanelFloatingPanelResizeHandle";

/**
 * 右サイドパネルコンポーネント
 */
export function RightFloatingPanel() {
	use(getAllOptions());
	const isRightPanelOpen = useStore((state) => {
		return state.isRightPanelOpen;
	});
	const toggleRightPanel = useStore((state) => {
		return state.toggleRightPanel;
	});
	const rightPanelWidth = useStore((state) => state.rightPanelWidth);
	const isResizing = useStore((state) => state.isResizing);

	return (
		<aside
			className={cn(
				"h-full flex shrink-0 overflow-hidden",
				!isResizing && "transition-[width] duration-300 ease-in-out",
			)}
			style={{
				width: isRightPanelOpen ? `${rightPanelWidth + 24}px` : "24px",
				minWidth: isRightPanelOpen ? `${rightPanelWidth + 24}px` : "24px",
			}}
			aria-label={RIGHT_PANEL_ARIA}
			data-testid="right-side-panel"
		>
			{/* トグルボタン (縦全体のストリップ) */}
			<RightFloatingPanelToggleButton
				isOpen={isRightPanelOpen}
				onClick={toggleRightPanel}
			/>
			{/* パネル本体 */}
			<RightFloatingPanelBody width={rightPanelWidth}>
				{isRightPanelOpen && <RightPanelFloatingPanelResizeHandle />}
			</RightFloatingPanelBody>
		</aside>
	);
}
