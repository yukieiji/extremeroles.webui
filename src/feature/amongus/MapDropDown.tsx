import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { OptionDropdownControl } from "@/components/parts/OptionDropdownControl";
import { TYPOGRAPHY } from "@/designConstants";
import { createAuNavigateId } from "@/hooks/useOptionNavigation";
import { auOptionMetaData } from "@/logics/api";
import { useUpdateAuOptionSelection } from "@/logics/api.store";
import { getMapName } from "@/noTrans";
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

	const optionMeta = auOptionMetaData.options[mapOptionId];

	if (!optionMeta) {
		return null;
	}

	// 数値のマップIDを名称に変換して表示する
	const displayValues = optionMeta.range.map((v) => getMapName(Number(v)));

	const isHighlighted = mapOptionId && highlightedAuOptionId === mapOptionId;

	const navigateId = createAuNavigateId(mapOptionId);

	return (
		<div className="border border-border-strong rounded-lg overflow-hidden bg-n4-components-background shadow-md">
			<HighlightWrapper
				id={navigateId}
				isHighlighted={isHighlighted}
				isInset={true}
			>
				<div className="flex items-center justify-between p-2">
					<div className="flex items-center">
						{/* アコーディオンの矢印アイコンのスペースを確保して配置を揃える */}
						<div className="w-5" />
						<span className={`${TYPOGRAPHY.LABEL} text-text-primary`}>
							{optionMeta.title}
						</span>
					</div>
					<div className="p-1">
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
				</div>
			</HighlightWrapper>
		</div>
	);
}
