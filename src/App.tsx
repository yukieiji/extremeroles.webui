import { Suspense, use, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorView } from "./components/blocks/ErrorView";
import { LoadingView } from "./components/blocks/LoadingView";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/sonner";
import { AuOptionEditor } from "./feature/amongus/AuOptionEditor";
import { BlockableDialog } from "./feature/BlockableDialog";
import { BlockableLoading } from "./feature/BlockableLoading";
import { ExROptionEditor } from "./feature/exr/ExROptionEditor";
import { PresetSelector } from "./feature/exr/PresetSelector";
import { OptionGroupToggleSidebar } from "./feature/OptionGroupToggleSidebar";
import { RightSidePanel } from "./feature/rightsidepanel/RightSidePanel";
import { RoleFilterViewer } from "./feature/rolefilter/RoleFilterViewer";
import { SynchronizeButtons } from "./feature/SynchronizeButtons";
import { SearchBar } from "./feature/search/SearchBar";
import { translationMetaData } from "./logics/api";
import { getAllOptions, resetApiCache } from "./logics/api.store";
import { applyTheme } from "./logics/themeUtils";
import { AU_OPTIONS_TITLE, EXR_OPTIONS_TITLE } from "./noTrans";
import { useStore } from "./useStore";

/**
 * プリセットセレクターを表示するためのコンテナコンポーネント
 * データを取得し、Suspense境界内で動作します
 */
function PresetSelectorContainer() {
	use(getAllOptions());
	return <PresetSelector />;
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
	use(getAllOptions());
	if (selectedTab === "RoleFilter") {
		return <RoleFilterViewer />;
	}
	return selectedTab === "ExR" ? <ExROptionEditor /> : <AuOptionEditor />;
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

	const titleMap = {
		Au: AU_OPTIONS_TITLE,
		ExR: EXR_OPTIONS_TITLE,
		RoleFilter: translationMetaData.RoleAssignFilter,
	};

	return (
		<section
			data-testid="main-content-section"
			className="flex flex-col transition-opacity duration-200 h-full overflow-hidden"
		>
			<div className="px-4 pt-4 flex items-center flex-wrap">
				<div className="flex items-center flex-1 gap-4">
					<h2 className="text-2xl font-bold whitespace-nowrap text-text-primary">
						{titleMap[selectedTab]}
					</h2>
					<div className="flex flex-row gap-4 flex-wrap">
						{(selectedTab === "ExR" || selectedTab === "Au") && <SearchBar />}
						{selectedTab === "ExR" && (
							<Suspense
								fallback={
									<div className="w-48 h-8 bg-app-background animate-pulse rounded" />
								}
							>
								<PresetSelectorContainer />
							</Suspense>
						)}
					</div>
					{isSidebarPending && (
						<div className="w-6 h-6 border border-info border-t-transparent rounded-full animate-spin"></div>
					)}
				</div>
				<SynchronizeButtons />
			</div>
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-64">
						<div className="w-12 h-12 border-4 border-info border-t-transparent rounded-full animate-spin"></div>
					</div>
				}
			>
				<div className="px-2 pt-2 flex-1 min-h-0 flex flex-col">
					<EditorContainer />
				</div>
			</Suspense>
		</section>
	);
}

/**
 * アプリケーションのルートコンテンツ
 */
function RootContent() {
	use(getAllOptions());
	const setWindowWidth = useStore((state) => state.setWindowWidth);
	const theme = useStore((state) => state.appSetting.theme ?? "system");

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [setWindowWidth]);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			if (theme === "system") {
				applyTheme("system");
			}
		};

		applyTheme(theme);

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	return (
		<SidebarProvider>
			<Toaster position="top-center" />
			<BlockableLoading />
			<BlockableDialog />
			<OptionGroupToggleSidebar />
			<SidebarInset className="min-w-0 h-svh overflow-hidden">
				<MainContent />
			</SidebarInset>
			<RightSidePanel />
		</SidebarProvider>
	);
}

/**
 * メインアプリケーションコンポーネント
 */
function App() {
	return (
		<ErrorBoundary FallbackComponent={ErrorView} onReset={resetApiCache}>
			<Suspense fallback={<LoadingView />}>
				<RootContent />
			</Suspense>
		</ErrorBoundary>
	);
}

export default App;
