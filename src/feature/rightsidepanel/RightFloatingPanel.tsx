import { use, useCallback, useEffect } from "react";
import { ViewerGroupAccordion } from "../../components/blocks/ViewerGroupAccordion";
import { RightPanelGroupColumnLayout } from "../../components/parts/RightPanelGroupColumnLayout";
import { getAllOptions } from "../../logics/api.store";
import {
	AU_SETTINGS_TITLE,
	CLOSE,
	EXR_SETTINGS_TITLE,
	PANEL_CLOSE_ARIA,
	PANEL_OPEN_ARIA,
	RIGHT_PANEL_ARIA,
	RIGHT_PANEL_TITLE,
	SETTING_VALUES_TITLE,
} from "../../noTrans";
import { useStore } from "../../useStore";
import { AuOptionViewer } from "./AuOptionViewer";
import { ExROptionViewer } from "./ExROptionViewer";

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
	const setRightPanelWidth = useStore((state) => state.setRightPanelWidth);
	const isResizing = useStore((state) => state.isResizing);
	const setIsResizing = useStore((state) => state.setIsResizing);

	const isSettingsOpen = useStore((state) => state.isSettingsOpen);
	const toggleSettings = useStore((state) => state.toggleSettings);
	const isAuSettingsOpen = useStore((state) => state.isAuSettingsOpen);
	const toggleAuSettings = useStore((state) => state.toggleAuSettings);
	const isExrSettingsOpen = useStore((state) => state.isExrSettingsOpen);
	const toggleExrSettings = useStore((state) => state.toggleExrSettings);

	const MIN_WIDTH = 320;

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
			const maxWidth = window.innerWidth * 0.8;

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
				<button
					type="button"
					onClick={toggleRightPanel}
					className="h-full w-6 bg-blue-600 text-white shadow-mdhover:bg-blue-700 flex items-center justify-center cursor-pointer"
					aria-label={isRightPanelOpen ? PANEL_CLOSE_ARIA : PANEL_OPEN_ARIA}
				>
					<span className="text-sm font-bold">
						{isRightPanelOpen ? "▶" : "◀"}
					</span>
				</button>

				{/* パネル本体 */}
				<aside
					className="h-full bg-white border-l border-gray-200 shadow-2xl relative"
					style={{
						width: rightPanelWidth,
					}}
					aria-label={RIGHT_PANEL_ARIA}
				>
					{/* リサイズハンドル */}
					{isRightPanelOpen && (
						<div
							onMouseDown={handleMouseDown}
							className="absolute left-0 top-0 h-full w-1 cursor-ew-resize hover:bg-blue-400 transition-colors z-50"
							aria-hidden="true"
						/>
					)}
					<div className="flex flex-col h-full">
						<div className="flex items-center justify-between p-4 border-b border-gray-100">
							<h2 className="text-lg font-semibold">{RIGHT_PANEL_TITLE}</h2>
						</div>
						<div className="flex-1 overflow-y-auto p-3">
							<ViewerGroupAccordion
								title={SETTING_VALUES_TITLE}
								isOpen={isSettingsOpen}
								onToggle={toggleSettings}
							>
								<RightPanelGroupColumnLayout>
									<ViewerGroupAccordion
										title={AU_SETTINGS_TITLE}
										isOpen={isAuSettingsOpen}
										onToggle={toggleAuSettings}
									>
										<AuOptionViewer />
									</ViewerGroupAccordion>
									<ViewerGroupAccordion
										title={EXR_SETTINGS_TITLE}
										isOpen={isExrSettingsOpen}
										onToggle={toggleExrSettings}
									>
										<ExROptionViewer />
									</ViewerGroupAccordion>
								</RightPanelGroupColumnLayout>
							</ViewerGroupAccordion>
						</div>
					</div>
				</aside>
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
