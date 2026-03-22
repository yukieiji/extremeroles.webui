import { useStore } from '../useStore';
import { OptionSliderControl } from '../components/parts/OptionSliderControl';
import { OptionDropdownControl } from '../components/parts/OptionDropdownControl';
import { getUniqueOptionId } from '../logics/optionUtils';
import type { ExROptionDto } from '../type';

interface ExROptionControlProps {
  categoryId: number;
  option: ExROptionDto;
}

/**
 * オプションの種類に応じた操作用コンポーネントをレンダリングする
 */
export function ExROptionControl({ categoryId, option }: ExROptionControlProps) {
  const uniqueId = getUniqueOptionId(categoryId, option.Id);
  const currentSelection = useStore((state) => {
    return state.effectiveSelections[uniqueId] ?? option.Selection;
  });
  const TEMP_updateExROptionSelection = useStore((state) => {
    return state.TEMP_updateExROptionSelection;
  });

  const handleChange = (newSelection: number) => {
    TEMP_updateExROptionSelection(uniqueId, newSelection);
  };

  const { Type, Values } = option.RangeMeta;

  if (Type === 'String') {
    return (
      <OptionDropdownControl
        selection={currentSelection}
        values={Values as string[]}
        onChange={handleChange}
      />
    );
  }

  if (Type === 'Int32' || Type === 'Single') {
    return (
      <OptionSliderControl
        selection={currentSelection}
        values={Values as number[]}
        format={option.Format}
        onChange={handleChange}
      />
    );
  }

  return null;
}
