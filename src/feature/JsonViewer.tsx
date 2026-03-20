import { use } from 'react';
import { useStore } from '../useStore';
import { getExrOptions, getAuOptions } from '../logics/api';
import { ExROptionEditor } from './ExROptionEditor';
import { AuOptionEditor } from './AuOptionEditor';

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
