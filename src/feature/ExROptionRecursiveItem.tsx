import { useStore } from '../useStore';
import { OptionAccordion } from '../components/blocks/OptionAccordion';
import { ExROptionRow } from './ExROptionRow';
import { ExROptionItem } from './ExROptionItem';
import { getUniqueOptionId } from '../logics/optionUtils';
import type { ExROptionDto } from '../type';

interface ExROptionRecursiveItemProps {
  categoryId: number;
  option: ExROptionDto;
  depth: number;
}

/**
 * 子要素を持つオプションをアコーディオンとして表示するコンポーネント
 */
export function ExROptionRecursiveItem({ categoryId, option, depth = 0 }: ExROptionRecursiveItemProps) {
  const uniqueId = getUniqueOptionId(categoryId, option.Id);
  const isOpen = useStore((state) => {
    return state.openedExROptionIds[uniqueId] ?? false;
  });
  const toggleExROption = useStore((state) => {
    return state.toggleExROption;
  });

  const handleToggle = () => {
    toggleExROption(uniqueId);
  };

  return (
    <OptionAccordion
      optionItem={<ExROptionRow categoryId={categoryId} option={option} depth={depth} isLeaf={false} />}
      isOpen={isOpen}
      onToggle={handleToggle}
      className={depth > 0 ? 'border-l-2 border-blue-500/30 ml-4' : ''}
    >
      <div className="flex flex-col">
        {option.Childs.map((child) => (
          <ExROptionItem key={child.Id} categoryId={categoryId} option={child} depth={depth + 1} />
        ))}
      </div>
    </OptionAccordion>
  );
}
