import { use, useEffect } from "react";
import { getAllOptions } from "@/logics/api.store";
import { CLOSE } from "@/noTrans";
import { useStore } from "@/useStore";
import { RightFloatingPanelBody } from "./RightFloatingPanelBody";
import { RightFloatingPanelToggleButton } from "./RightFloatingPanelToggleButton";
import { RightPanelFloatingPanelResizeHandle } from "./RightPanelFloatingPanelResizeHandle";

/**
 * 右フローティングパネルコンポーネント
 */
export function RightFloatingPanel() {
	use(getAllOptions());
	const isRightPanelOpen = useStore((state) => {
		return state.isRightPanelOpen;
	});
	const toggleRightPanel = useStore((state) => {
		return state.toggleRightPanel;
	});
	const setRightPanelOpen = useStore((state) => {
		return state.setRightPanelOpen;
	});
	const rightPanelWidth = useStore((state) => state.rightPanelWidth);

	// Escapeキーでパネルを閉じるためのグローバルリスナー
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isRightPanelOpen) {
				setRightPanelOpen(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isRightPanelOpen, setRightPanelOpen]);

	return (
		<>
			<div
				className="fixed top-0 right-0 h-full flex z-40"
				style={{
					transform: isRightPanelOpen
						? "translateX(0)"
						: `translateX(${rightPanelWidth}px)`,
					transition: "transform 300ms ease-in-out",
				}}
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
			</div>

			{/* オーバーレイ */}
			{isRightPanelOpen && (
				<button
					type="button"
					className="fixed inset-0 bg-black/20 z-30 cursor-default"
					onClick={toggleRightPanel}
					aria-label={CLOSE}
				/>
			)}
		</>
	);
}
