import { useStore } from '../useStore';
import { Accordion } from '../components/parts/Accordion';
import type { ExRTabDto } from '../type';

interface ExROptionEditorProps {
  data: ExRTabDto[];
}

/**
 * ExRオプションを表示するコンポーネント
 */
export function ExROptionEditor({ data }: ExROptionEditorProps) {
  const selectedExRTabId = useStore((state) => {
    return state.selectedExRTabId;
  });
  const setSelectedExRTabId = useStore((state) => {
    return state.setSelectedExRTabId;
  });
  const openedExRCategoryIds = useStore((state) => {
    return state.openedExRCategoryIds;
  });
  const toggleExRCategory = useStore((state) => {
    return state.toggleExRCategory;
  });

  const selectedTab = data.find((tab) => {
    return tab.Id === selectedExRTabId;
  }) || data[0];

  // オプションが空でない、かつ少なくとも1つのオプションが有効なカテゴリのみを抽出
  const visibleCategories = selectedTab.Categories.filter((category) => {
    return category.Options.length > 0 && category.Options.some((opt) => {
      return opt.IsActive;
    });
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {data.map((tab) => {
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

      <div className="flex flex-col">
        {visibleCategories.map((category) => {
          return (
            <Accordion
              key={category.Id}
              title={category.Name}
              isOpen={!!openedExRCategoryIds[category.Id]}
              onToggle={() => {
                toggleExRCategory(category.Id);
              }}
            >
              <div className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-auto max-h-[40vh]">
                <pre
                  data-testid={`category-json-${category.Id}`}
                  className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed"
                >
                  {JSON.stringify(category.Options, null, 2)}
                </pre>
              </div>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}
