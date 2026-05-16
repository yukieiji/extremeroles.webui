import { use, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getAllOptions } from "@/logics/api.store";
import { RIGHT_PANEL_ARIA } from "@/noTrans";
import { useStore } from "@/useStore";
import { RightSidePanelBody } from "./RightSidePanelBody";
import {
	calculateMaxRightPanelWidth,
	RIGHT_PANEL_TOGGLE_WIDTH,
	RightSidePanelResizeHandle,
} from "./RightSidePanelResizeHandle";
import { RightSidePanelToggleButton } from "./RightSidePanelToggleButton";

/**
 * 右サイドパネルコンポーネント
 */
export function RightSidePanel() {
	use(getAllOptions());
	const isRightPanelOpen = useStore((state) => {
		return state.isRightPanelOpen;
	});
	const toggleRightPanel = useStore((state) => {
		return state.toggleRightPanel;
	});
	const rightPanelWidth = useStore((state) => state.rightPanelWidth);
	const setRightPanelWidth = useStore((state) => state.setRightPanelWidth);
	const isResizing = useStore((state) => state.isResizing);

	// 画面サイズ変更時にパネル幅をクランプする
	useEffect(() => {
		const handleResize = () => {
			const maxWidth = calculateMaxRightPanelWidth(window.innerWidth);
			if (rightPanelWidth > maxWidth) {
				setRightPanelWidth(maxWidth);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [rightPanelWidth, setRightPanelWidth]);

	const maxWidth = calculateMaxRightPanelWidth(
		typeof window !== "undefined" ? window.innerWidth : 1920,
	);

	return (
		<aside
			className={cn(
				"h-svh flex shrink-0 sticky top-0",
				!isResizing && "transition-[width] duration-300 ease-in-out",
			)}
			style={{
				width: isRightPanelOpen
					? `${rightPanelWidth + RIGHT_PANEL_TOGGLE_WIDTH}px`
					: `${RIGHT_PANEL_TOGGLE_WIDTH}px`,
				maxWidth: `${maxWidth + RIGHT_PANEL_TOGGLE_WIDTH}px`,
			}}
			aria-label={RIGHT_PANEL_ARIA}
			data-testid="right-side-panel"
		>
			{/* パネル本体 */}
			<div
				className={cn(
					"h-full overflow-hidden flex-1 min-w-0",
					!isRightPanelOpen && "w-0",
				)}
			>
				<RightSidePanelBody>
					{isRightPanelOpen && <RightSidePanelResizeHandle />}
				</RightSidePanelBody>
			</div>
			{/* トグルボタン (リールのようなボタン) */}
			<RightSidePanelToggleButton
				isOpen={isRightPanelOpen}
				onClick={toggleRightPanel}
			/>
		</aside>
	);
}
