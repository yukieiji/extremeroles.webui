import { useCallback, useEffect } from "react";

import { useStore } from "@/useStore";

export const MIN_RIGHT_PANEL_WIDTH = 320;
export const RIGHT_PANEL_TOGGLE_WIDTH = 24;
export const DEFAULT_WINDOW_WIDTH = 1920;

export const calculateMaxRightPanelWidth = (windowWidth: number) => {
	// メインコンテンツが極端に狭くならないように、画面幅の80%を上限とする
	// また、左サイドバー(約300px)があることを考慮して、実際の表示領域を超えないように制御する
	// トグルボタンの幅(24px)を考慮して、パネル本体の最大幅を計算する
	const maxAsideWidth = Math.min(windowWidth * 0.8, windowWidth - 300);
	return maxAsideWidth - RIGHT_PANEL_TOGGLE_WIDTH;
};

export function RightSidePanelResizeHandle() {
	const setIsResizing = useStore((state) => state.setIsResizing);
	const isResizing = useStore((state) => state.isResizing);
	const setRightPanelWidth = useStore((state) => state.setRightPanelWidth);
	const rightPanelWidth = useStore((state) => state.rightPanelWidth);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			setIsResizing(true);
		},
		[setIsResizing],
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isResizing) {
				return;
			}

			const newWidth = window.innerWidth - e.clientX;
			const maxWidth = calculateMaxRightPanelWidth(window.innerWidth);

			if (newWidth >= MIN_RIGHT_PANEL_WIDTH && newWidth <= maxWidth) {
				setRightPanelWidth(newWidth);
			} else if (newWidth > maxWidth) {
				setRightPanelWidth(maxWidth);
			} else if (newWidth < MIN_RIGHT_PANEL_WIDTH) {
				setRightPanelWidth(MIN_RIGHT_PANEL_WIDTH);
			}
		},
		[isResizing, setRightPanelWidth],
	);

	const handleMouseUp = useCallback(() => {
		if (isResizing) {
			setIsResizing(false);
			localStorage.setItem("rightPanelWidth", rightPanelWidth.toString());
		}
	}, [isResizing, rightPanelWidth, setIsResizing]);

	useEffect(() => {
		if (isResizing) {
			document.body.style.cursor = "ew-resize";
			window.addEventListener("mousemove", handleMouseMove);
			window.addEventListener("mouseup", handleMouseUp);
		} else {
			document.body.style.cursor = "";
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		}

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isResizing, handleMouseMove, handleMouseUp]);

	return (
		<div
			onMouseDown={handleMouseDown}
			className="absolute left-0 top-0 h-full w-1 cursor-ew-resize hover:bg-blue-400 transition-colors z-50"
			aria-hidden="true"
			data-testid="resize-handle"
		/>
	);
}
