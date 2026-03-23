import { findClosestIndex } from '../../logics/optionUtils';

interface OptionSingleSliderProps {
  label: string;
  selection: number;
  values: number[];
  format: string;
  onChange: (selection: number) => void;
  disabled?: boolean;
}

function OptionSingleSlider({
  label,
  selection,
  values,
  format,
  onChange,
  disabled = false,
}: OptionSingleSliderProps) {
  const currentValue = values[selection] ?? values[0] ?? 0;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      return;
    }

    onChange(findClosestIndex(values, val));
  };

  const formattedValue = format.includes('{0}')
    ? format.replace('{0}', currentValue.toString())
    : `${format} ${currentValue}`.trim();

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between gap-2 px-1">
        <span className="text-xs text-gray-400 font-medium">{label}</span>
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={currentValue}
            onChange={handleInputChange}
            disabled={disabled}
            className="w-12 px-1 py-0.5 text-right text-xs bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
          <span className="text-[10px] text-gray-500 whitespace-nowrap">
            ({formattedValue})
          </span>
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={values.length - 1}
        step={1}
        value={selection}
        onChange={handleSliderChange}
        disabled={disabled}
        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

interface OptionPairedSliderControlProps {
  minSelection: number;
  maxSelection: number;
  minValues: number[];
  maxValues: number[];
  format: string;
  onMinChange: (selection: number) => void;
  onMaxChange: (selection: number) => void;
  disabled?: boolean;
}

/**
 * 最小・最大のペア設定用のスライダーコントロール
 */
export function OptionPairedSliderControl({
  minSelection,
  maxSelection,
  minValues,
  maxValues,
  format,
  onMinChange,
  onMaxChange,
  disabled = false,
}: OptionPairedSliderControlProps) {
  const handleMinChange = (newMinIdx: number) => {
    const newMinVal = minValues[newMinIdx];
    const currentMaxVal = maxValues[maxSelection];

    if (newMinVal > currentMaxVal) {
      // 最小が最大を超えた場合、最大を同じ値（またはそれに近い値）に調整
      onMaxChange(findClosestIndex(maxValues, newMinVal));
    }
    onMinChange(newMinIdx);
  };

  const handleMaxChange = (newMaxIdx: number) => {
    const newMaxVal = maxValues[newMaxIdx];
    const currentMinVal = minValues[minSelection];

    if (newMaxVal < currentMinVal) {
      // 最大が最小を下回った場合、最小を同じ値（またはそれに近い値）に調整
      onMinChange(findClosestIndex(minValues, newMaxVal));
    }
    onMaxChange(newMaxIdx);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-[32rem]">
      <OptionSingleSlider
        label="Min"
        selection={minSelection}
        values={minValues}
        format={format}
        onChange={handleMinChange}
        disabled={disabled}
      />
      <OptionSingleSlider
        label="Max"
        selection={maxSelection}
        values={maxValues}
        format={format}
        onChange={handleMaxChange}
        disabled={disabled}
      />
    </div>
  );
}
