import type { ReactNode } from 'react';

interface OptionItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * オプション項目を表示するためのコンテナコンポーネント
 */
export function OptionItem({ children, className = '' }: OptionItemProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 px-4 bg-gray-900/50 hover:bg-gray-800/50 transition-colors border-b border-gray-800 last:border-0 ${className}`}>
      {children}
    </div>
  );
}
