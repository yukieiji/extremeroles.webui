import { useCallback, useEffect } from "react";

import { useStore } from "@/useStore";

const MIN_WIDTH = 320;

export function RightPanelFloatingPanelResizeHandle() {
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
			// メインコンテンツが極端に狭くならないように、画面幅の80%を上限とする
			// また、サイドバーがあることを考慮して、実際の表示領域を超えないように制御する
			const maxWidth = Math.min(window.innerWidth * 0.8, window.innerWidth - 300);

			if (newWidth >= MIN_WIDTH && newWidth <= maxWidth) {
				setRightPanelWidth(newWidth);
			} else if (newWidth > maxWidth) {
				setRightPanelWidth(maxWidth);
			} else if (newWidth < MIN_WIDTH) {
				setRightPanelWidth(MIN_WIDTH);
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
