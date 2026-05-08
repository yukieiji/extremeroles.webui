import { use, useCallback, useEffect } from "react";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { getAllOptions } from "@/logics/api.store";
import { useStore } from "@/useStore";
import { RightFloatingPanelBody } from "./RightFloatingPanelBody";

const MIN_WIDTH = 320;

export function RightSidebar() {
	use(getAllOptions());
	const rightPanelWidth = useStore((state) => state.rightPanelWidth);
	const setRightPanelWidth = useStore((state) => state.setRightPanelWidth);
	const isResizing = useStore((state) => state.isResizing);
	const setIsResizing = useStore((state) => state.setIsResizing);

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
			const maxWidth = window.innerWidth * 0.9;

			if (newWidth >= MIN_WIDTH && newWidth <= maxWidth) {
				setRightPanelWidth(newWidth);
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
		<Sidebar
			side="right"
			collapsible="offcanvas"
			style={
				{
					"--sidebar-width": `${rightPanelWidth}px`,
				} as React.CSSProperties
			}
		>
			<SidebarContent>
				<RightFloatingPanelBody />
			</SidebarContent>
			<SidebarRail onMouseDown={handleMouseDown} />
		</Sidebar>
	);
}
