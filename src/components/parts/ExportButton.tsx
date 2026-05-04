import { EXPORT_CSV_LABEL, EXPORT_CSV_TITLE } from "../../noTrans";

interface ExportButtonProps {
	onClick: () => void;
	disabled?: boolean;
}

/**
 * エクスポートボタンコンポーネント
 * アイコンとテキストを表示します
 */
export function ExportButton({ onClick, disabled }: ExportButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`
        flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200
        ${disabled ? "text-gray-400 cursor-not-allowed bg-gray-50 border-gray-100" : "text-green-600 hover:bg-green-50 active:bg-green-100 shadow-sm border border-gray-200 bg-white"}
      `}
			title={EXPORT_CSV_TITLE}
			aria-label={EXPORT_CSV_TITLE}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
				<polyline points="7 10 12 15 17 10" />
				<line x1="12" x2="12" y1="15" y2="3" />
			</svg>
			<span className="text-sm font-medium">{EXPORT_CSV_LABEL}</span>
		</button>
	);
}
