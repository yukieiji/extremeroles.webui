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

	return (
		<>
			{/* トグルボタン */}
			<button
				type="button"
				onClick={toggleRightPanel}
				className={`
          fixed right-4 bottom-4 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg
          hover:bg-blue-700 transition-transform active:scale-95 flex items-center justify-center
          ${isRightPanelOpen ? "rotate-90" : ""}
        `}
				aria-label={isRightPanelOpen ? "パネルを閉じる" : "パネルを開く"}
				style={{ width: "48px", height: "48px" }}
			>
				<span className="text-2xl font-bold">
					{isRightPanelOpen ? "×" : "☰"}
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
						<button
							type="button"
							onClick={toggleRightPanel}
							className="p-1 hover:bg-gray-100 rounded-md transition-colors w-8 h-8 flex items-center justify-center"
						>
							<span className="text-xl">×</span>
						</button>
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
					onKeyDown={(e) => {
						if (e.key === "Escape") toggleRightPanel();
					}}
					aria-label="閉じる"
				/>
			)}
		</>
	);
}
