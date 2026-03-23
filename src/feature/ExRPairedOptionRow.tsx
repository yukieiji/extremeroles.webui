import { useStore } from '../useStore';
import { OptionItem } from '../components/parts/OptionItem';
import { OptionNameDisplay } from '../components/parts/OptionNameDisplay';
import { OptionRowContainer } from '../components/blocks/OptionRowContainer';
import { OptionPairedSliderControl } from '../components/parts/OptionPairedSliderControl';
import { getUniqueOptionId } from '../logics/optionUtils';
import type { ExROptionDto } from '../type';

interface ExRPairedOptionRowProps {
  categoryId: number;
  baseName: string;
  min: ExROptionDto;
  max: ExROptionDto;
}

/**
 * 最小・最大ペアのオプションを1行で表示するコンポーネント
 */
export function ExRPairedOptionRow({ categoryId, baseName, min, max }: ExRPairedOptionRowProps) {
  const minUniqueId = getUniqueOptionId(categoryId, min.Id);
  const maxUniqueId = getUniqueOptionId(categoryId, max.Id);

  const effectiveMinSelection = useStore((state) => {
    return state.effectiveSelections[minUniqueId];
  });
  const effectiveMaxSelection = useStore((state) => {
    return state.effectiveSelections[maxUniqueId];
  });

  const minSelection = effectiveMinSelection ?? min.Selection;
  const maxSelection = effectiveMaxSelection ?? max.Selection;

  const TEMP_updateExROptionSelection = useStore((state) => {
    return state.TEMP_updateExROptionSelection;
  });

  const handleMinChange = (newSelection: number) => {
    TEMP_updateExROptionSelection(minUniqueId, newSelection);
  };

  const handleMaxChange = (newSelection: number) => {
    TEMP_updateExROptionSelection(maxUniqueId, newSelection);
  };

  const content = (
    <OptionItem className="min-h-[4.5rem]">
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-200 break-words">
          <OptionNameDisplay name={baseName} />
        </span>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        <OptionPairedSliderControl
          minSelection={minSelection}
          maxSelection={maxSelection}
          minValues={min.RangeMeta.Values as number[]}
          maxValues={max.RangeMeta.Values as number[]}
          format={min.Format}
          onMinChange={handleMinChange}
          onMaxChange={handleMaxChange}
        />
      </div>
    </OptionItem>
  );

  return (
    <OptionRowContainer
      leading={<span className="text-gray-500 select-none text-xs">・</span>}
      content={content}
    />
  );
}
