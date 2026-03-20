interface SidebarToggleBtnProps {
  onClick: () => void;
  isOpen: boolean;
}

/**
 * サイドバーの開閉を切り替えるボタン
 */
export function SidebarToggleBtn({ onClick, isOpen }: SidebarToggleBtnProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
      aria-label={isOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
    >
      {isOpen ? '◀' : '▶'}
    </button>
  );
}
