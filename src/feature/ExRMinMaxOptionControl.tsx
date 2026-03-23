import { useStore } from '../useStore';
import { OptionSliderControl } from '../components/parts/OptionSliderControl';
import { getUniqueOptionId } from '../logics/optionUtils';
import type { ExROptionDto } from '../type';

interface ExRMinMaxOptionControlProps {
  categoryId: number;
  option: ExROptionDto;
  type: 'min' | 'max';
  suffix: string;
  otherOption: ExROptionDto;
}

/**
 * 最小・最大オプション専用のコントロール
 */
export function ExRMinMaxOptionControl({
  categoryId,
  option,
  type,
  suffix,
  otherOption,
}: ExRMinMaxOptionControlProps) {
  const uniqueId = getUniqueOptionId(categoryId, option.Id);
  const otherUniqueId = getUniqueOptionId(categoryId, otherOption.Id);

  const effectiveSelection = useStore((state) => {
    return state.effectiveSelections[uniqueId];
  });
  const otherEffectiveSelection = useStore((state) => {
    return state.effectiveSelections[otherUniqueId];
  });

  const currentSelection = effectiveSelection ?? option.Selection;
  const otherCurrentSelection = otherEffectiveSelection ?? otherOption.Selection;

  const TEMP_updateMultipleExROptionSelections = useStore((state) => {
    return state.TEMP_updateMultipleExROptionSelections;
  });

  const handleChange = (newSelection: number) => {
    const updates: Record<string, number> = {
      [uniqueId]: newSelection,
    };

    // バリデーション: 最小 > 最大 の場合、もう一方も調整する
    if (type === 'min') {
      if (newSelection > otherCurrentSelection) {
        updates[otherUniqueId] = newSelection;
      }
    } else {
      if (newSelection < otherCurrentSelection) {
        updates[otherUniqueId] = newSelection;
      }
    }

    TEMP_updateMultipleExROptionSelections(updates);
  };

  return (
    <div className="flex flex-col gap-1 w-full max-w-[12rem]">
      <span className="text-[10px] text-gray-400 font-bold ml-1">{suffix}</span>
      <OptionSliderControl
        selection={currentSelection}
        values={option.RangeMeta.Values as number[]}
        format={option.Format}
        onChange={handleChange}
      />
    </div>
  );
}
