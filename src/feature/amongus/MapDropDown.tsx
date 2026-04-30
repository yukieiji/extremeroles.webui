import { HighlightWrapper } from "../../components/parts/HighlightWrapper";
import { OptionDropdownControl } from "../../components/parts/OptionDropdownControl";
import { auOptionMetaData } from "../../logics/api";
import { useUpdateAuOptionSelection } from "../../logics/api.store";
import { useStore } from "../../useStore";

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

	const optionMeta = auOptionMetaData.options[mapOptionId];

	if (!optionMeta) {
		return null;
	}

	// 後で翻訳を適用するが、それまでは一旦 range に含まれる値をそのまま表示する
	const displayValues = optionMeta.range.map((v) => v.toString());

	const isHighlighted = mapOptionId && highlightedAuOptionId === mapOptionId;

	return (
		<div className="border bg-gray-800 border-gray-700 rounded-lg overflow-hidden">
			<HighlightWrapper isHighlighted={isHighlighted} isInset={true}>
				<div className="flex items-center justify-between py-2 px-4">
					<div className="flex items-center gap-3">
						{/* アコーディオンの矢印アイコンのスペースを確保して配置を揃える */}
						<div className="w-5" />
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
			</HighlightWrapper>
		</div>
	);
}
