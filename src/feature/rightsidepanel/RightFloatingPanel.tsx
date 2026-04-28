import { useEffect } from "react";
import { CompactAccordion } from "../../components/blocks/CompactAccordion";
import { useStore } from "../../useStore";
import { AuTab0Viewer } from "./AuTab0Viewer";

/**
 * 右フローティングパネルコンポーネント
 */
export function RightFloatingPanel() {
	const isRightPanelOpen = useStore((state) => {
		return state.isRightPanelOpen;
	});
	const toggleRightPanel = useStore((state) => {
		return state.toggleRightPanel;
	});
	const setRightPanelOpen = useStore((state) => {
		return state.setRightPanelOpen;
	});

	const isSettingsOpen = useStore((state) => state.isSettingsOpen);
	const toggleSettings = useStore((state) => state.toggleSettings);
	const isAuSettingsOpen = useStore((state) => state.isAuSettingsOpen);
	const toggleAuSettings = useStore((state) => state.toggleAuSettings);
	const isExrSettingsOpen = useStore((state) => state.isExrSettingsOpen);
	const toggleExrSettings = useStore((state) => state.toggleExrSettings);

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
			{/* トグルボタン (縦全体のストリップ) */}
			<button
				type="button"
				onClick={toggleRightPanel}
				className={`
          fixed top-0 z-50 h-full w-6 bg-blue-600 text-white shadow-md
          hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center
          cursor-pointer
          ${isRightPanelOpen ? "right-80" : "right-0"}
        `}
				aria-label={isRightPanelOpen ? "パネルを閉じる" : "パネルを開く"}
			>
				<span className="text-sm font-bold">
					{isRightPanelOpen ? "▶" : "◀"}
				</span>
			</button>

			{/* パネル本体 */}
			<aside
				className={`
          fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-2xl z-40
          transition-transform duration-300 ease-in-out transform
          ${isRightPanelOpen ? "translate-x-0" : "translate-x-full"}
        `}
				aria-label="右フローティングパネル"
			>
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-between p-4 border-b border-gray-100">
						<h2 className="text-lg font-semibold">Right Panel</h2>
					</div>
					<div className="flex-1 overflow-y-auto p-3">
						<CompactAccordion
							title="設定値"
							isOpen={isSettingsOpen}
							onToggle={toggleSettings}
						>
							<div className="flex flex-col">
								<CompactAccordion
									title="AmongUsの設定"
									isOpen={isAuSettingsOpen}
									onToggle={toggleAuSettings}
								>
									<AuTab0Viewer />
								</CompactAccordion>
								<CompactAccordion
									title="ExRの設定"
									isOpen={isExrSettingsOpen}
									onToggle={toggleExrSettings}
								>
									<p className="text-gray-400 text-sm">ExRの設定コンテンツ</p>
								</CompactAccordion>
							</div>
						</CompactAccordion>
					</div>
				</div>
			</aside>

			{/* オーバーレイ */}
			{isRightPanelOpen && (
				<button
					type="button"
					className="fixed inset-0 bg-black/20 z-30 cursor-default"
					onClick={toggleRightPanel}
					aria-label="閉じる"
				/>
			)}
		</>
	);
}
