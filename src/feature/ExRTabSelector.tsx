import { useTransition, useEffect } from 'react';
import { useStore } from '../useStore';
import { ColoredText } from '../components/parts/ColoredText';
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
  const setIsTabPending = useStore((state) => {
    return state.setIsTabPending;
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // トランジションが完了したらペンディング状態を解除する
    if (!isPending) {
      setIsTabPending(false);
    }
  }, [isPending, setIsTabPending]);

  const handleClick = (id: OptionTab) => {
    if (id === selectedExRTabId) {
      return;
    }
    startTransition(() => {
      setSelectedExRTabId(id);
    });
  };

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
      {tabs.map((tab) => {
        return (
          <button
            key={tab.Id}
            onClick={() => {
              handleClick(tab.Id);
            }}
            className={`
              px-4 py-2 rounded-t-lg transition-colors font-medium
              ${selectedExRTabId === tab.Id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            `}
          >
            <ColoredText text={tab.Name} />
          </button>
        );
      })}
    </div>
  );
}
