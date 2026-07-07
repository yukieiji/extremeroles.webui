import { use, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getAllOptions } from "@/logics/api.store";
import { useStore } from "@/useStore";
import { RightSidePanelToggleButton } from "../../components/parts/RightSidePanelToggleButton";
import { RightSidePanelBody } from "./RightSidePanelBody";
import {
	calculateMaxRightPanelWidth,
	DEFAULT_WINDOW_WIDTH,
	RIGHT_PANEL_TOGGLE_WIDTH,
	RightSidePanelResizeHandle,
} from "./RightSidePanelResizeHandle";

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

	const windowWidth = useStore((state) => state.windowWidth);
	const maxWidth = calculateMaxRightPanelWidth(
		windowWidth || DEFAULT_WINDOW_WIDTH,
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
			data-testid="right-side-panel"
			data-state={isRightPanelOpen ? "open" : "closed"}
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
