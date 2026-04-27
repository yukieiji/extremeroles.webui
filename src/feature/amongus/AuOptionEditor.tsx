import { AuCategoryList } from "./AuCategoryList";
import { AuTabSelector } from "./AuTabSelector";

/**
 * Auオプションを表示するコンポーネント
 */
export function AuOptionEditor() {
	return (
		<div className="flex flex-col gap-4">
			<AuTabSelector />
			<AuCategoryList />
		</div>
	);
}
