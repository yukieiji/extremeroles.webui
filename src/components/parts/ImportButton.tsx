import { Upload } from "lucide-react";
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
		reader.onerror = (e) => {
			console.error("FileReader error:", e);
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
				<Upload size={18} aria-hidden="true" />
				<span>{IMPORT_BUTTON_TITLE}</span>
			</button>
		</>
	);
}
