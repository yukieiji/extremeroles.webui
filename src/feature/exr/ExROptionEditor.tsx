import { EditorContainer } from "../../components/blocks/EditorContainer";
import { ExRCategoryList } from "./ExRCategoryList";
import { ExRTabSelector } from "./ExRTabSelector";

/**
 * ExRオプションを表示するコンポーネント。
 * 子コンポーネントに状態を分散させることで、再レンダリングの範囲を最小限に抑えています。
 */
export function ExROptionEditor() {
	return (
		<EditorContainer
			selector={<ExRTabSelector />}
			mainView={<ExRCategoryList />}
		/>
	);
}
