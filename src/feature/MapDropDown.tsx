import { OptionDropdownControl } from "../components/parts/OptionDropdownControl";
import { auOptionMetaData } from "../logics/api";
import { useUpdateAuOptionSelection } from "../logics/api.store";
import { useStore } from "../useStore";
import { AuOptionRow } from "./AuOptionRow";

interface MapDropDownProps {
	categoryId: number;
}

/**
 * マップ選択用のドロップダウンコンポーネント
 * Tab 0 の最初のカテゴリ（マップ）で使用される
 */
export function MapDropDown({ categoryId }: MapDropDownProps) {
	const categoryMeta = auOptionMetaData.categoryMetaData[categoryId];
	const updateAuOption = useUpdateAuOptionSelection();

	// 最初のオプションがマップであることを想定
	const mapOptionId = categoryMeta?.options[0];
	const selection = useStore((state) =>
		mapOptionId ? (state.auValue[mapOptionId] ?? 0) : 0,
	);

	if (!categoryMeta || categoryMeta.options.length === 0) {
		return null;
	}

	const [_, ...otherOptionIds] = categoryMeta.options;
	const optionMeta = auOptionMetaData.options[mapOptionId];

	if (!optionMeta) {
		return null;
	}

	// 後で翻訳を適用するためのプレースホルダーとして、現在は数値または既存の値を表示
	const displayValues = optionMeta.range.map((_, index) => index.toString());

	return (
		<div
			className="border border-gray-700 rounded-lg overflow-hidden mb-2"
			data-testid={`au-category-${categoryId}`}
		>
			<div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
				<div className="flex items-center gap-3">
					{/* アコーディオンの矢印アイコンのスペースを確保して配置を揃える */}
					<div className="w-5 h-5" />
					<span className="font-semibold text-gray-200">
						{optionMeta.title}
					</span>
				</div>
				<div className="w-48">
					<OptionDropdownControl
						values={displayValues}
						selection={selection}
						onChange={(newSelection) => {
							updateAuOption({
								auOptionId: mapOptionId,
								selection: newSelection,
							});
						}}
					/>
				</div>
			</div>
			{otherOptionIds.length > 0 && (
				<div className="p-4 bg-gray-900 space-y-1">
					{otherOptionIds.map((optionId) => (
						<AuOptionRow key={optionId} auOptionId={optionId} />
					))}
				</div>
			)}
		</div>
	);
}
