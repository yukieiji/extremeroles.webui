import { RightPanelGroupColumnLayout } from "@/components/parts/RightPanelGroupColumnLayout";
import { auOptionMetaData } from "@/logics/api";
import { AuTab0GeneralCategory } from "./AuTab0GeneralCategory";

/**
 * Auの設定内容を表示し、ダブルクリックで該当箇所へ移動するコンポーネント
 */
export function AuOptionViewer() {
	const tab0CategoryIds = auOptionMetaData.tabCategoryMap[0] || [];

	return (
		<RightPanelGroupColumnLayout>
			{tab0CategoryIds.map((categoryId, index) => {
				const isMapCategory = index === 0;
				if (isMapCategory) {
					return null;
				}
				return (
					<AuTab0GeneralCategory key={categoryId} categoryId={categoryId} />
				);
			})}
		</RightPanelGroupColumnLayout>
	);
}
