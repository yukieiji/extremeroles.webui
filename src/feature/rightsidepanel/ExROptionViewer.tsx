import { exrOptionMetaData } from "../../logics/api";
import { ExRTabId } from "../../type";
import { ExRViewerCategory } from "./ExRViewerCategory";

/**
 * ExRの設定内容を表示するコンポーネント
 */
export function ExROptionViewer() {
	const generalTab = exrOptionMetaData.tabs[ExRTabId.GeneralTab];

	if (!generalTab) {
		return null;
	}

	return (
		<div className="flex flex-col gap-1">
			{generalTab.categoryIds.map((categoryId) => (
				<ExRViewerCategory key={categoryId} categoryId={categoryId} />
			))}
		</div>
	);
}
