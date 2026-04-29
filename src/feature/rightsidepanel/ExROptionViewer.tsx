import { exrOptionMetaData } from "../../logics/api";
import { ExRTabId } from "../../type";
import { ExRGeneralCategory } from "./ExRGeneralCategory";

/**
 * ExRの設定内容を表示し、ダブルクリックで該当箇所へ移動するコンポーネント
 */
export function ExROptionViewer() {
	const generalTab = exrOptionMetaData.tabs[ExRTabId.GeneralTab];
	const categoryIds = generalTab?.categoryIds || [];

	return (
		<div className="flex flex-col gap-1">
			{categoryIds.map((categoryId) => (
				<ExRGeneralCategory key={categoryId} categoryId={categoryId} />
			))}
		</div>
	);
}
