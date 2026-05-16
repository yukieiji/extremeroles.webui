import { Suspense, use, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorView } from "./components/blocks/ErrorView";
import { LoadingView } from "./components/blocks/LoadingView";
import { ExportButton } from "./components/parts/ExportButton";
import { ImportButton } from "./components/parts/ImportButton";
import { SyncButton } from "./components/parts/SyncButton";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AuOptionEditor } from "./feature/amongus/AuOptionEditor";
import { BlockableDialog } from "./feature/BlockableDialog";
import { BlockableLoading } from "./feature/BlockableLoading";
import { ExROptionEditor } from "./feature/exr/ExROptionEditor";
import { PresetSelector } from "./feature/exr/PresetSelector";
import { OptionGroupToggleSidebar } from "./feature/OptionGroupToggleSidebar";
import { RightSidePanel } from "./feature/rightsidepanel/RightSidePanel";
import { RoleFilterViewer } from "./feature/rolefilter/RoleFilterViewer";
import {
	useBackendUpdate,
	useExportCsv,
	useSyncBackend,
} from "./hooks/useBackend";
import { postExrCsv } from "./logics/api";
import { getAllOptions, resetApiCache } from "./logics/api.store";
import {
	AU_OPTIONS_TITLE,
	EXR_OPTIONS_TITLE,
	IMPORT_CONFIRM_MESSAGE,
	IMPORT_CONFIRM_TITLE,
	ROLE_FILTER_TITLE,
} from "./noTrans";
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

	const syncer = useSyncBackend();
	const backendUpdater = useBackendUpdate();
	const openDialog = useStore((state) => state.openBlockDialog);

	const handleImport = (csvBody: string) => {
		openDialog({
			type: "confirm",
			title: IMPORT_CONFIRM_TITLE,
			message: IMPORT_CONFIRM_MESSAGE,
			onConfirm: () => {
				backendUpdater(() => postExrCsv(csvBody));
			},
		});
	};
	const exporter = useExportCsv();

	const titleMap = {
		Au: AU_OPTIONS_TITLE,
		ExR: EXR_OPTIONS_TITLE,
		RoleFilter: ROLE_FILTER_TITLE,
	};

	return (
		<section
			data-testid="main-content-section"
			className="flex flex-col gap-4 transition-opacity duration-200 h-full overflow-hidden"
		>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-5 flex-1 p-4">
					<h2 className="text-2xl font-bold whitespace-nowrap">
						{titleMap[selectedTab]}
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
				<ImportButton onImport={handleImport} />
				<ExportButton onClick={exporter} />
				<SyncButton onClick={syncer} />
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
 * アプリケーションのルートコンテンツ
 */
function RootContent() {
	use(getAllOptions());
	const setWindowWidth = useStore((state) => state.setWindowWidth);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [setWindowWidth]);

	return (
		<SidebarProvider>
			<BlockableLoading />
			<BlockableDialog />
			<OptionGroupToggleSidebar />
			<SidebarInset className="min-w-0">
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
