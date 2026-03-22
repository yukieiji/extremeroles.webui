import { useCallback } from 'react';

interface OptionDropdownControlProps {
  selection: number;
  values: string[];
  onChange: (selection: number) => void;
  disabled?: boolean;
}

/**
 * 文字列オプション（String）用のドロップダウンコンポーネント
 */
export function OptionDropdownControl({
  selection,
  values,
  onChange,
  disabled = false,
}: OptionDropdownControlProps) {
  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(parseInt(e.target.value, 10));
    },
    [onChange]
  );

  return (
    <select
      value={selection}
      onChange={handleSelectChange}
      disabled={disabled}
      className="block w-full sm:w-48 px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded text-gray-200 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {values.map((value, index) => (
        <option key={index} value={index}>
          {value}
        </option>
      ))}
    </select>
  );
}
