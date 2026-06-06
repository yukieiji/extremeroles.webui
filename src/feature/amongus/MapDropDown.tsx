import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { OptionDropdownControl } from "@/components/parts/OptionDropdownControl";
import {
	createAuCategoryNavigateId,
	createAuNavigateId,
} from "@/hooks/useOptionNavigation";
import { auOptionMetaData } from "@/logics/api";
import { useUpdateAuOptionSelection } from "@/logics/api.store";
import { useStore } from "@/useStore";

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
	const mapOptionId = categoryMeta?.options[0] ?? 0;
	const selection = useStore((state) => state.auValue[mapOptionId] ?? 0);
	const highlightedAuOptionId = useStore(
		(state) => state.highlightedAuOptionId,
	);
	const highlightedAuCategoryId = useStore(
		(state) => state.highlightedAuCategoryId,
	);

	const optionMeta = auOptionMetaData.options[mapOptionId];

	if (!optionMeta) {
		return null;
	}

	// 後で翻訳を適用するが、それまでは一旦 range に含まれる値をそのまま表示する
	const displayValues = optionMeta.range.map((v) => v.toString());

	const isHighlighted = mapOptionId && highlightedAuOptionId === mapOptionId;
	const isCategoryHighlighted = highlightedAuCategoryId === categoryId;

	const navigateId = createAuNavigateId(mapOptionId);
	const categoryNavigateId = createAuCategoryNavigateId(categoryId);

	return (
		<HighlightWrapper
			id={categoryNavigateId}
			isHighlighted={isCategoryHighlighted}
			isInset={false}
		>
			<div className="border border-gray-700 rounded-lg overflow-hidden">
				<HighlightWrapper
					id={navigateId}
					isHighlighted={isHighlighted}
					isInset={true}
				>
					<div className="flex items-center justify-between py-2 px-4">
						<div className="flex items-center gap-3">
							{/* アコーディオンの矢印アイコンのスペースを確保して配置を揃える */}
							<div className="w-5" />
							<span className="font-semibold text-gray-200">
								{optionMeta.title}
							</span>
						</div>
						<OptionDropdownControl
							values={displayValues}
							selection={selection}
							onChange={(newSelectionValue) => {
								updateAuOption({
									auOptionId: mapOptionId,
									selection: newSelectionValue,
								});
							}}
						/>
					</div>
				</HighlightWrapper>
			</div>
		</HighlightWrapper>
	);
}
