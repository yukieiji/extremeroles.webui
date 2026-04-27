import { EditorContainer } from "../../components/blocks/EditorContainer";
import { AuCategoryList } from "./AuCategoryList";
import { AuTabSelector } from "./AuTabSelector";

/**
 * Auオプションを表示するコンポーネント
 */
export function AuOptionEditor() {
	return (
		<EditorContainer
			selector={<AuTabSelector />}
			mainView={<AuCategoryList />}
		/>
	);
}
