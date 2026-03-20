import { useStore } from '../../useStore';
import type { SelectedTab } from '../../slices/uiSlice';
import { SidebarToggleBtn } from '../parts/SidebarToggleBtn';

/**
 * サイドバーコンポーネント
 */
export function Sidebar() {
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

  const handleTabChange = (tab: SelectedTab) => {
    setSelectedTab(tab);
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-gray-100 border-r border-gray-300 transition-all duration-300 z-10
        ${isSidebarOpen ? 'w-64' : 'w-12'}
      `}
    >
      <div className="flex justify-end p-2 border-b border-gray-200">
        <SidebarToggleBtn onClick={toggleSidebar} isOpen={isSidebarOpen} />
      </div>

      {isSidebarOpen ? (
        <nav className="p-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold border-b border-gray-400 pb-2">Options</h2>
          <ul className="flex flex-col gap-2">
            <li>
              <button
                onClick={() => {
                  handleTabChange('ExR');
                }}
                className={`
                  w-full text-left p-2 rounded-md transition-colors
                  ${selectedTab === 'ExR' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}
                `}
              >
                ExR Options
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  handleTabChange('Au');
                }}
                className={`
                  w-full text-left p-2 rounded-md transition-colors
                  ${selectedTab === 'Au' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}
                `}
              >
                Au Options
              </button>
            </li>
          </ul>
        </nav>
      ) : (
        <div className="flex flex-col items-center pt-8 gap-4">
          <button
            onClick={() => {
              handleTabChange('ExR');
            }}
            title="ExR Options"
            className={`
              w-8 h-8 rounded-full transition-colors flex items-center justify-center font-bold
              ${selectedTab === 'ExR' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
            `}
          >
            E
          </button>
          <button
            onClick={() => {
              handleTabChange('Au');
            }}
            title="Au Options"
            className={`
              w-8 h-8 rounded-full transition-colors flex items-center justify-center font-bold
              ${selectedTab === 'Au' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}
            `}
          >
            A
          </button>
        </div>
      )}
    </aside>
  );
}
