import { use } from 'react';
import { useStore } from '../useStore';
import { getExrOptions, getAuOptions } from '../logics/api';

/**
 * JSONを表示するコンポーネント
 */
export function JsonViewer() {
  const selectedTab = useStore((state) => {
    return state.selectedTab;
  });

  // React 19 の use() フックを使用して Promise を待機
  const exrData = use(getExrOptions());
  const auData = use(getAuOptions());

  const dataToDisplay = selectedTab === 'ExR' ? exrData : auData;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">
        {selectedTab === 'ExR' ? 'ExR Options' : 'Au Options'} JSON
      </h2>
      <div className="bg-gray-800 text-green-400 p-6 rounded-lg shadow-lg overflow-auto max-h-[80vh]">
        <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
          {JSON.stringify(dataToDisplay, null, 2)}
        </pre>
      </div>
    </section>
  );
}
