import { Suspense, use } from 'react';
import { OptionGroupToggleSidebar } from './feature/OptionGroupToggleSidebar';
import { LoadingView } from './feature/LoadingView';
import { ExROptionEditor } from './feature/ExROptionEditor';
import { AuOptionEditor } from './feature/AuOptionEditor';
import { useStore } from './useStore';
import { getExrOptions, getAuOptions } from './logics/api';

/**
 * メインコンテンツコンポーネント
 * Suspense 境界の内側でデータを取得・表示するために分離
 */
function MainContent() {
  const selectedTab = useStore((state) => {
    return state.selectedTab;
  });

  // React 19 の use() フックを使用してデータを取得
  const exrData = use(getExrOptions());
  const auData = use(getAuOptions());

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">
        {selectedTab === 'ExR' ? 'ExR Options' : 'Au Options'} JSON
      </h2>
      {selectedTab === 'ExR' ? (
        <ExROptionEditor data={exrData} />
      ) : (
        <AuOptionEditor data={auData} />
      )}
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
