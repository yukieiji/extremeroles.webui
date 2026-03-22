import { ExROptionRow } from './ExROptionRow';
import { ExROptionRecursiveItem } from './ExROptionRecursiveItem';
import type { ExROptionDto } from '../type';

interface ExROptionItemProps {
  categoryId: number;
  option: ExROptionDto;
  depth?: number;
}

/**
 * ExRオプションの個別の項目を表示・管理するエントリーポイント
 */
export function ExROptionItem({ categoryId, option, depth = 0 }: ExROptionItemProps) {
  if (!option.IsActive) {
    return null;
  }

  const hasActiveChildren = option.Childs && option.Childs.length > 1;

  if (hasActiveChildren) {
    return (
      <ExROptionRecursiveItem
        categoryId={categoryId}
        option={option}
        depth={depth}
      />
    );
  }

  return <ExROptionRow categoryId={categoryId} option={option} depth={depth} isLeaf={true} />;
}
