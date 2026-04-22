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

	if (!categoryMeta || categoryMeta.options.length === 0) {
		return null;
	}

	// 最初のオプションがマップであることを想定
	const [mapOptionId, ...otherOptionIds] = categoryMeta.options;
	const optionMeta = auOptionMetaData.options[mapOptionId];
	const selection = useStore((state) => state.auValue[mapOptionId] ?? 0);

	if (!optionMeta) {
		return null;
	}

	// 後で翻訳を適用するためのプレースホルダーとして、現在は数値または既存の値を表示
	const displayValues = optionMeta.range.map((_, index) => index.toString());

	return (
		<div className="mb-4">
			<div className="flex items-center justify-between py-3 px-4 bg-gray-800/30 rounded-lg mb-2 border border-gray-700/50">
				<div className="flex flex-col">
					<span className="text-gray-200 text-sm font-semibold">
						{optionMeta.title}
					</span>
				</div>
				<div className="w-48">
					<OptionDropdownControl
						values={displayValues}
						selection={selection}
						onChange={(newSelection) => {
							updateAuOption({ auOptionId: mapOptionId, selection: newSelection });
						}}
					/>
				</div>
			</div>
			<div className="space-y-1">
				{otherOptionIds.map((optionId) => (
					<AuOptionRow key={optionId} auOptionId={optionId} />
				))}
			</div>
		</div>
	);
}
