import { useEffect } from "react";
import { useStore } from "../useStore";

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
					<div className="flex-1 overflow-y-auto p-4">
						{/* 中身はまだ書かなくて良い */}
						<p className="text-gray-500 text-center mt-10">
							Content will be placed here.
						</p>
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
