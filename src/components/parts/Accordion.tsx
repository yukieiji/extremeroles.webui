import type { ReactNode } from 'react';

interface AccordionProps {
  title: ReactNode;
  headerExtra?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

/**
 * ステートレスなアコーディオンコンポーネント
 */
export function Accordion({
  title,
  headerExtra,
  isOpen,
  onToggle,
  children,
}: AccordionProps) {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden mb-2">
      <div className="flex items-center bg-gray-800 hover:bg-gray-700 transition-colors">
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 flex items-center gap-3 p-4 text-left"
          aria-expanded={isOpen}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span className="font-semibold text-gray-200">{title}</span>
        </button>
        {headerExtra && <div className="flex items-center px-4">{headerExtra}</div>}
      </div>
      <div
        data-testid="accordion-content"
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0">
          {isOpen && (
            <div className="p-4 bg-gray-900 border-t border-gray-700">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
