interface OptionToggleControlProps {
  selection: number;
  onChange: (selection: number) => void;
  disabled?: boolean;
}

/**
 * 2値（0, 1）のトグルスイッチコンポーネント
 * Selection が 1 のとき ON、0 のとき OFF
 */
export function OptionToggleControl({
  selection,
  onChange,
  disabled = false,
}: OptionToggleControlProps) {
  const isChecked = selection === 1;

  const handleToggle = () => {
    if (disabled) {
      return;
    }
    onChange(isChecked ? 0 : 1);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleToggle}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900
        ${isChecked ? 'bg-blue-600' : 'bg-gray-700'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
          transition duration-200 ease-in-out
          ${isChecked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}
