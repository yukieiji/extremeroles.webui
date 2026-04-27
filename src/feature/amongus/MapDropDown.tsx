import { OptionDropdownControl } from "../../components/parts/OptionDropdownControl";
import { auOptionMetaData } from "../../logics/api";
import { useUpdateAuOptionSelection } from "../../logics/api.store";
import { useStore } from "../../useStore";
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
	const highlightedAuOptionId = useStore(
		(state) => state.highlightedAuOptionId,
	);

	if (!categoryMeta || categoryMeta.options.length === 0) {
		return null;
	}

	const [_, ...otherOptionIds] = categoryMeta.options;
	const optionMeta = auOptionMetaData.options[mapOptionId];

	if (!optionMeta) {
		return null;
	}

	// 後で翻訳を適用するが、それまでは一旦 range に含まれる値をそのまま表示する
	const displayValues = optionMeta.range.map((v) => v.toString());

	const isHighlighted = mapOptionId && highlightedAuOptionId === mapOptionId;

	return (
		<div
			className="border border-gray-700 rounded-lg overflow-hidden mb-2"
			data-testid={`au-category-${categoryId}`}
		>
			<div
				id={`au-option-${mapOptionId}`}
				className={`flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 transition-all duration-500 ${
					isHighlighted ? "ring-2 ring-blue-500 bg-blue-500/10" : ""
				}`}
			>
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
