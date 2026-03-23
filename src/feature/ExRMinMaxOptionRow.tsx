import { OptionItem } from '../components/parts/OptionItem';
import { OptionNameDisplay } from '../components/parts/OptionNameDisplay';
import { OptionRowContainer } from '../components/blocks/OptionRowContainer';
import { ExRMinMaxOptionControl } from './ExRMinMaxOptionControl';
import type { ExROptionDto } from '../type';

interface ExRMinMaxOptionRowProps {
  categoryId: number;
  baseName: string;
  minOption: ExROptionDto;
  minSuffix: string;
  maxOption: ExROptionDto;
  maxSuffix: string;
  depth?: number;
}

/**
 * 最小と最大のオプションを1行にまとめて表示するコンポーネント
 */
export function ExRMinMaxOptionRow({
  categoryId,
  baseName,
  minOption,
  minSuffix,
  maxOption,
  maxSuffix,
  depth = 0,
}: ExRMinMaxOptionRowProps) {
  const content = (
    <OptionItem className="min-h-[4rem] py-2">
      <div className="flex-1 min-w-0 mr-4">
        <span className="text-sm font-medium text-gray-200 break-words">
          <OptionNameDisplay name={baseName} />
        </span>
      </div>
      <div className="flex-shrink-0 flex items-center gap-4">
        <ExRMinMaxOptionControl
          categoryId={categoryId}
          option={minOption}
          type="min"
          suffix={minSuffix}
          otherOption={maxOption}
        />
        <ExRMinMaxOptionControl
          categoryId={categoryId}
          option={maxOption}
          type="max"
          suffix={maxSuffix}
          otherOption={minOption}
        />
      </div>
    </OptionItem>
  );

  return (
    <OptionRowContainer
      leading={<span className="text-gray-500 select-none text-xs">・</span>}
      content={content}
      className={depth > 0 ? 'border-l-2 border-blue-500/30 ml-4' : ''}
    />
  );
}
