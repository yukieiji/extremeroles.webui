import type { ReactNode } from 'react';

interface OptionAccordionProps {
  optionItem: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

/**
 * 設定可能なオプション自体をヘッダーに持つ、階層構造用の専用アコーディオン
 */
export function OptionAccordion({ optionItem, isOpen, onToggle, children }: OptionAccordionProps) {
  return (
    <div className="flex flex-col border-b border-gray-800 last:border-0">
      <div className="flex items-stretch bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
        {/* トグルボタン（左側） */}
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center justify-center w-10 shrink-0 text-gray-500 hover:text-gray-300 border-r border-gray-800/50"
          aria-expanded={isOpen}
          aria-label={isOpen ? '閉じる' : '開く'}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 設定項目（右側） */}
        <div className="flex-1">
          {optionItem}
        </div>
      </div>

      {/* 子要素（ネストされたオプション） */}
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 bg-black/10">
          {isOpen && (
            <div className="flex flex-col">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
