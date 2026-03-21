import { useTransition, useEffect } from 'react';
import { useStore } from '../useStore';
import type { SelectedTab } from '../slices/optionGroupToggleSidebarSlice';
import { OptionGroupToggleSidebarToggleButton } from '../components/parts/OptionGroupToggleSidebarToggleButton';

/**
 * タブ情報の定義
 */
interface TabItem {
  id: SelectedTab;
  label: string;
  shortLabel: string;
}

const TABS: TabItem[] = [
  { id: 'Au', label: 'Au Options', shortLabel: 'A' },
  { id: 'ExR', label: 'ExR Options', shortLabel: 'E' },
];

/**
 * サイドバーコンポーネント
 */
export function OptionGroupToggleSidebar() {
  const isSidebarOpen = useStore((state) => {
    return state.isSidebarOpen;
  });
  const selectedTab = useStore((state) => {
    return state.selectedTab;
  });
  const toggleSidebar = useStore((state) => {
    return state.toggleSidebar;
  });
  const setSelectedTab = useStore((state) => {
    return state.setSelectedTab;
  });
  const resetAll = useStore((state) => {
    return state.resetAll;
  });
  const resetViewer = useStore((state) => {
    return state.resetViewer;
  });
  const setIsSidebarPending = useStore((state) => {
    return state.setIsSidebarPending;
  });
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (tab: SelectedTab) => {
    startTransition(() => {
      setSelectedTab(tab);
    });
  };

  useEffect(() => {
    setIsSidebarPending(isPending);
  }, [isPending, setIsSidebarPending]);

  const handleReset = () => {
    // 実際にはAPI側でキャッシュリセットする必要があるが
    // ここではグローバルに公開されたリセット関数を呼ぶ想定
    // @ts-ignore - テスト用
    if (window.resetApp) {
      // @ts-ignore
      window.resetApp();
    }
    resetAll();
    resetViewer();
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-gray-100 border-r border-gray-300 transition-all duration-300 z-10
        ${isSidebarOpen ? 'w-64' : 'w-12'}
      `}
      aria-label="オプションサイドバー"
    >
      <div className="flex justify-between items-center p-2 border-b border-gray-200">
        <button
          onClick={handleReset}
          className="text-[10px] bg-red-100 text-red-600 px-1 rounded hover:bg-red-200"
          data-testid="reset-button"
        >
          Reset
        </button>
        <OptionGroupToggleSidebarToggleButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
      </div>

      {isSidebarOpen ? (
        <nav className="p-4 flex flex-col gap-4">
          <ul className="flex flex-col gap-2">
            {TABS.map((tab) => {
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => {
                      handleTabChange(tab.id);
                    }}
                    className={`
                      w-full text-left p-2 rounded-md transition-colors
                      ${selectedTab === tab.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}
                    `}
                  >
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : (
        <div className="flex flex-col items-center pt-8 gap-4">
          {TABS.map((tab) => {
            return (
              <button
                key={tab.id}
                onClick={() => {
                  handleTabChange(tab.id);
                }}
                title={tab.label}
                className={`
                  w-8 h-8 rounded-full transition-colors flex items-center justify-center font-bold
                  ${selectedTab === tab.id ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
                `}
              >
                {tab.shortLabel}
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}
