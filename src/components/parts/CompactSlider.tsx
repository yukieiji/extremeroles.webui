import React from 'react';

interface CompactSliderProps {
  label: string;
  values: number[];
  currentSelection: number;
  onSelectionChange: (selection: number) => void;
  onInputChange: (value: number) => void;
  testId?: string;
}

/**
 * カテゴリアコーディオンのヘッダーなどで使用する、コンパクトなスライダーとテキスト入力のセット
 * (純粋なUIコンポーネント)
 */
export function CompactSlider({
  label,
  values,
  currentSelection,
  onSelectionChange,
  onInputChange,
  testId,
}: CompactSliderProps) {
  const currentValue = values[currentSelection] ?? values[0] ?? 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelectionChange(parseInt(e.target.value, 10));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onInputChange(val);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // アコーディオンの開閉を防ぐ
    e.stopPropagation();
  };

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 bg-gray-900/50 rounded border border-gray-700/50"
      onClick={handleClick}
      data-testid={testId}
    >
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
