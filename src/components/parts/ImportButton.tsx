import { Upload } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";

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
			<Button
				onClick={handleClick}
				disabled={disabled}
				className={TYPOGRAPHY.LABEL}
			>
				<Upload />
				{translationMetaData.importCsv}
			</Button>
		</>
	);
}
