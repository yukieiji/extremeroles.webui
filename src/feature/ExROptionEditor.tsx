import { useStore } from '../useStore';
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

  const selectedTab = data.find((tab) => {
    return tab.Id === selectedExRTabId;
  }) || data[0];

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

      <div className="bg-gray-800 text-green-400 p-6 rounded-lg shadow-lg overflow-auto max-h-[80vh]">
        <pre
          data-testid="exr-json-pre"
          className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed"
        >
          {JSON.stringify(selectedTab, null, 2)}
        </pre>
      </div>
    </div>
  );
}
