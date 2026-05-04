import { useRef } from "react";
import { IMPORT_BUTTON_ARIA, IMPORT_BUTTON_TITLE } from "../../noTrans";

interface ImportButtonProps {
	onImport: (csvContent: string) => void;
	disabled?: boolean;
}

/**
 * インポートボタンコンポーネント
 * アイコンとテキストを表示します。クリックするとファイル選択ダイアログを開きます。
 */
export function ImportButton({ onImport, disabled }: ImportButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result;
			if (typeof content === "string") {
				onImport(content);
			}
		};
		reader.readAsText(file, "UTF-8");

		// 入力をクリアして、同じファイルを再度選択できるようにする
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<>
			<input
				type="file"
				accept=".csv"
				ref={fileInputRef}
				onChange={handleFileChange}
				className="hidden"
			/>
			<button
				type="button"
				onClick={handleClick}
				disabled={disabled}
				className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
          ${disabled ? "text-gray-400 cursor-not-allowed bg-gray-50 border-gray-200" : "text-blue-600 hover:bg-blue-50 active:bg-blue-100 shadow-sm border border-gray-200 bg-white"}
        `}
				title={IMPORT_BUTTON_TITLE}
				aria-label={IMPORT_BUTTON_ARIA}
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
					<polyline points="17 8 12 3 7 8" />
					<line x1="12" x2="12" y1="3" y2="15" />
				</svg>
				<span>{IMPORT_BUTTON_TITLE}</span>
			</button>
		</>
	);
}
