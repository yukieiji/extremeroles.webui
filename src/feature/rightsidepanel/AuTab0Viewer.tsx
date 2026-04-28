import { use } from "react";
import { auOptionMetaData } from "../../logics/api";
import { getAllOptions } from "../../logics/api.store";
import { AuTab0GeneralCategory } from "./AuTab0GeneralCategory";
import { AuTab0MapCategory } from "./AuTab0MapCategory";

/**
 * Auのタブ0の設定内容を表示し、ダブルクリックで該当箇所へ移動するコンポーネント
 */
export function AuTab0Viewer() {
	use(getAllOptions());
	const tab0CategoryIds = auOptionMetaData.tabCategoryMap[0] || [];

	return (
		<div className="flex flex-col gap-1">
			{tab0CategoryIds.map((categoryId, index) => {
				const isMapCategory = index === 0;
				if (isMapCategory) {
					return <AuTab0MapCategory key={categoryId} categoryId={categoryId} />;
				}
				return (
					<AuTab0GeneralCategory key={categoryId} categoryId={categoryId} />
				);
			})}
		</div>
	);
}
