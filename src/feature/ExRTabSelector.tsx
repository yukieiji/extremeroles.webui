import { useStore } from '../useStore';
import type { ExRTabDto } from '../type';

interface ExRTabSelectorProps {
  tabs: ExRTabDto[];
}

/**
 * ExRオプションのタブ選択コンポーネント
 */
export function ExRTabSelector({ tabs }: ExRTabSelectorProps) {
  const selectedExRTabId = useStore((state) => {
    return state.selectedExRTabId;
  });
  const setSelectedExRTabId = useStore((state) => {
    return state.setSelectedExRTabId;
  });

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
      {tabs.map((tab) => {
        return (
          <button
            key={tab.Id}
            onClick={() => {
              setSelectedExRTabId(tab.Id);
            }}
            className={`
              px-4 py-2 rounded-t-lg transition-colors font-medium
              ${selectedExRTabId === tab.Id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            {tab.Name}
          </button>
        );
      })}
    </div>
  );
}
