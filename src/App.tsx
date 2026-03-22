import { Suspense, use } from 'react';
import { OptionGroupToggleSidebar } from './feature/OptionGroupToggleSidebar';
import { LoadingView } from './feature/LoadingView';
import { ExROptionEditor } from './feature/ExROptionEditor';
import { AuOptionEditor } from './feature/AuOptionEditor';
import { useStore } from './useStore';
import { getExrOptions, getAuOptions } from './logics/api';

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

  return selectedTab === 'ExR' ? (
    <ExROptionEditor data={exrData} />
  ) : (
    <AuOptionEditor data={auData} />
  );
}

/**
 * メインコンテンツコンポーネント
 * 状態管理と Suspense 境界の調整
 */
function MainContent() {
  const selectedTab = useStore((state) => {
    return state.selectedTab;
  });

  return (
    <section
      data-testid="main-content-section"
      className="flex flex-col gap-4"
    >
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">
          {selectedTab === 'ExR' ? 'ExR Options' : 'Au Options'} JSON
        </h2>
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
            ${isSidebarOpen ? 'ml-64' : 'ml-12'}
          `}
        >
          <MainContent />
        </main>
      </Suspense>
    </div>
  );
}

export default App;
