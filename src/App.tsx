import { Suspense, use } from "react";
import { AuOptionEditor } from "./feature/AuOptionEditor";
import { ExROptionEditor } from "./feature/ExROptionEditor";
import { LoadingView } from "./feature/LoadingView";
import { OptionGroupToggleSidebar } from "./feature/OptionGroupToggleSidebar";
import { PresetSelector } from "./feature/PresetSelector";
import { getAuOptions, getExrOptions } from "./logics/api";
import { useStore } from "./useStore";

/**
 * プリセットセレクターを表示するためのコンテナコンポーネント
 * データを取得し、Suspense境界内で動作します
 */
function PresetSelectorContainer() {
	const exrData = use(getExrOptions());
	return <PresetSelector tabs={exrData} />;
}

/**
 * オプションエディタを表示する内側のコンポーネント
 * データを取得し、選択されたタブに応じてエディタを表示します
 */
function EditorContainer() {
	const selectedTab = useStore((state) => {
		return state.selectedTab;
	});

	// React 19 の use() フックを使用してデータを取得
	const exrData = use(getExrOptions());
	const auData = use(getAuOptions());

	if (selectedTab === "ExR") {
		return <ExROptionEditor data={exrData} />;
	}

	return <AuOptionEditor data={auData} />;
}

/**
 * メインコンテンツコンポーネント
 * 状態管理と Suspense 境界の調整
 */
function MainContent() {
	const selectedTab = useStore((state) => {
		return state.selectedTab;
	});
	const isSidebarPending = useStore((state) => {
		return state.isSidebarPending;
	});

	return (
		<section
			data-testid="main-content-section"
			className={`flex flex-col gap-4 transition-opacity duration-200 ${isSidebarPending ? "is-pending opacity-50 pointer-events-none" : "opacity-100"}`}
			data-is-pending={isSidebarPending ? "true" : "false"}
		>
			<div className="flex items-center gap-4">
				<h2 className="text-2xl font-bold whitespace-nowrap">
					{selectedTab === "ExR" ? "ExR Options" : "Au Options"}
				</h2>
				{selectedTab === "ExR" && (
					<Suspense
						fallback={
							<div className="w-48 h-8 bg-gray-700 animate-pulse rounded" />
						}
					>
						<PresetSelectorContainer />
					</Suspense>
				)}
				{isSidebarPending && (
					<div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				)}
			</div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-64">
						<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
					</div>
				}
			>
				<EditorContainer />
			</Suspense>
		</section>
	);
}

/**
 * メインアプリケーションコンポーネント
 */
function App() {
	const isSidebarOpen = useStore((state) => {
		return state.isSidebarOpen;
	});

	return (
		<div className="min-h-screen bg-gray-50 flex">
			<Suspense fallback={<LoadingView />}>
				<OptionGroupToggleSidebar />
				<main
					className={`
            flex-1 p-8 transition-all duration-300
            ${isSidebarOpen ? "ml-64" : "ml-12"}
          `}
				>
					<MainContent />
				</main>
			</Suspense>
		</div>
	);
}

export default App;
