import { OptionItem } from '../components/parts/OptionItem';
import { OptionNameDisplay } from '../components/parts/OptionNameDisplay';
import { ExROptionControl } from './ExROptionControl';
import type { ExROptionDto } from '../type';

interface ExROptionRowProps {
  categoryId: number;
  option: ExROptionDto;
  depth?: number;
}

/**
 * オプションの名前とコントロールを1行で表示するコンポーネント
 */
export function ExROptionRow({ categoryId, option, depth = 0 }: ExROptionRowProps) {
  return (
    <OptionItem
      className={depth > 0 ? 'border-l-2 border-blue-500/30 ml-4' : ''}
    >
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-200 break-words">
          <OptionNameDisplay name={option.TranslatedName} />
        </span>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        <ExROptionControl categoryId={categoryId} option={option} />
      </div>
    </OptionItem>
  );
}
