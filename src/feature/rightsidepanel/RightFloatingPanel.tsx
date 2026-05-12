import { use, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getAllOptions } from "@/logics/api.store";
import { RIGHT_PANEL_ARIA } from "@/noTrans";
import { useStore } from "@/useStore";
import { RightFloatingPanelBody } from "./RightFloatingPanelBody";
import { RightFloatingPanelToggleButton } from "./RightFloatingPanelToggleButton";
import {
	calculateMaxRightPanelWidth,
	RightPanelFloatingPanelResizeHandle,
} from "./RightPanelFloatingPanelResizeHandle";

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

	return (
		<aside
			className={cn(
				"h-full flex shrink-0 overflow-hidden",
				!isResizing && "transition-[width] duration-300 ease-in-out",
			)}
			style={{
				width: isRightPanelOpen ? `${rightPanelWidth}px` : "0px",
				maxWidth: "80vw",
			}}
			aria-label={RIGHT_PANEL_ARIA}
			data-testid="right-side-panel"
		>
			{/* トグルボタン (画面右上に固定) */}
			<RightFloatingPanelToggleButton
				isOpen={isRightPanelOpen}
				onClick={toggleRightPanel}
			/>
			{/* パネル本体 */}
			<RightFloatingPanelBody>
				{isRightPanelOpen && <RightPanelFloatingPanelResizeHandle />}
			</RightFloatingPanelBody>
		</aside>
	);
}
