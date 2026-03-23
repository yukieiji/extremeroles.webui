import { useStore } from '../useStore';
import { getUniqueOptionId, findClosestIndex } from '../logics/optionUtils';
import type { ExROptionDto } from '../type';

interface ExRHeaderOptionControlProps {
  categoryId: number;
  option: ExROptionDto;
  label: string;
}

/**
 * カテゴリアコーディオンのヘッダーに表示するためのコンパクトなスライダーコントロール
 */
export function ExRHeaderOptionControl({
  categoryId,
  option,
  label,
}: ExRHeaderOptionControlProps) {
  const uniqueId = getUniqueOptionId(categoryId, option.Id);
  const effectiveSelection = useStore((state) => {
    return state.effectiveSelections[uniqueId];
  });
  const currentSelection = effectiveSelection ?? option.Selection;
  const TEMP_updateExROptionSelection = useStore((state) => {
    return state.TEMP_updateExROptionSelection;
  });

  const { Values } = option.RangeMeta;
  const values = Values as number[];
  const currentValue = values[currentSelection] ?? values[0] ?? 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    TEMP_updateExROptionSelection(uniqueId, parseInt(e.target.value, 10));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      return;
    }
    TEMP_updateExROptionSelection(uniqueId, findClosestIndex(values, val));
  };

  const handleClick = (e: React.MouseEvent) => {
    // アコーディオンの開閉を防ぐ
    e.stopPropagation();
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1 bg-gray-900/50 rounded border border-gray-700/50" onClick={handleClick}>
      <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{label}</span>
      <input
        type="range"
        min={0}
        max={values.length - 1}
        step={1}
        value={currentSelection}
        onChange={handleSliderChange}
        className="w-20 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <input
        type="text"
        value={currentValue}
        onChange={handleInputChange}
        className="w-10 px-1 py-0.5 text-right text-xs bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
