import { Suspense } from 'react';
import { OptionGroupToggleSidebar } from './components/blocks/OptionGroupToggleSidebar';
import { JsonViewer } from './feature/JsonViewer';
import { LoadingView } from './feature/LoadingView';
import { useStore } from './useStore';

/**
 * メインアプリケーションコンポーネント
 */
function App() {
  const isSidebarOpen = useStore((state) => {
    return state.isSidebarOpen;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <OptionGroupToggleSidebar />
      <main
        className={`
          flex-1 p-8 transition-all duration-300
          ${isSidebarOpen ? 'ml-64' : 'ml-12'}
        `}
      >
        <Suspense fallback={<LoadingView />}>
          <JsonViewer />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
