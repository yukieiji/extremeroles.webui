interface SyncButtonProps {
	onClick: () => void;
	disabled?: boolean;
}

/**
 * 同期ボタンコンポーネント
 * アイコンのみを表示します
 */
export function SyncButton({ onClick, disabled }: SyncButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`
        p-2 rounded-full transition-all duration-200
        ${disabled ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:bg-blue-50 active:bg-blue-100 shadow-sm border border-gray-200 bg-white"}
      `}
			title="同期"
			aria-label="データを同期"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
				<path d="M3 3v5h5" />
				<path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
				<path d="M16 16h5v5" />
			</svg>
		</button>
	);
}
