import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useExrNavigation } from "../../hooks/useExrNavigation";
import { exrOptionMetaData } from "../../logics/api";
import { groupOptionPairs } from "../../logics/optionUtils";
import type { UniqueOptionId } from "../../type";
import { useStore } from "../../useStore";
import { ExRTab0OptionValue } from "./ExRTab0OptionValue";

interface ExRTab0OptionRowProps {
	uniqueOptionId: UniqueOptionId;
	categoryId: number;
}

/**
 * ExRの各設定項目の行コンポーネント
 */
export function ExRTab0OptionRow({
	uniqueOptionId,
	categoryId,
}: ExRTab0OptionRowProps) {
	const exrValue = useStore((state) => state.exrValue);
	const { navigateToOption } = useExrNavigation();

	const option = exrOptionMetaData.options[uniqueOptionId];
	if (!option) {
		return null;
	}

	const valueData = exrValue[uniqueOptionId];
	if (!valueData) {
		return null;
	}

	const selection = valueData.selection;
	const value = valueData.values[selection];

	return (
		<div className="border-white border-b">
			<ViewerOptionRow
				title={option.metaData.translatedName}
				value={
					<ExRTab0OptionValue value={value} format={option.metaData.format} />
				}
				onDoubleClick={() => {
					navigateToOption(0, categoryId, uniqueOptionId);
				}}
			/>
		</div>
	);
}

interface ExRTab0OptionPairRowProps {
	baseName: string;
	minUniqueId: UniqueOptionId;
	maxUniqueId: UniqueOptionId;
	categoryId: number;
}

export function ExRTab0OptionPairRow({
	baseName,
	minUniqueId,
	maxUniqueId,
	categoryId,
}: ExRTab0OptionPairRowProps) {
	const exrValue = useStore((state) => state.exrValue);
	const { navigateToOption } = useExrNavigation();

	const minOption = exrOptionMetaData.options[minUniqueId];
	const maxOption = exrOptionMetaData.options[maxUniqueId];

	if (!minOption || !maxOption) {
		return null;
	}

	const minValueData = exrValue[minUniqueId];
	const maxValueData = exrValue[maxUniqueId];

	if (!minValueData || !maxValueData) {
		return null;
	}

	const minValue = minValueData.values[minValueData.selection];
	const maxValue = maxValueData.values[maxValueData.selection];

	return (
		<div className="border-white border-b">
			<ViewerOptionRow
				title={baseName}
				value={
					<div className="flex items-center">
						<ExRTab0OptionValue
							value={minValue}
							format={minOption.metaData.format}
						/>
						<span className="text-blue-400 mx-0.5">-</span>
						<ExRTab0OptionValue
							value={maxValue}
							format={maxOption.metaData.format}
						/>
					</div>
				}
				onDoubleClick={() => {
					// 最小の方へ移動
					navigateToOption(0, categoryId, minUniqueId);
				}}
			/>
		</div>
	);
}

interface ExRTab0OptionListProps {
	categoryId: number;
	uniqueOptionIds: UniqueOptionId[];
}

export function ExRTab0OptionList({
	categoryId,
	uniqueOptionIds,
}: ExRTab0OptionListProps) {
	const isExROptionActive = useStore((state) => state.isExROptionActive);
	const activeOptions = uniqueOptionIds.filter((id) => isExROptionActive[id]);

	if (activeOptions.length === 0) {
		return null;
	}

	const groupedItems = groupOptionPairs(activeOptions);

	return (
		<div className="flex flex-col gap-0.5">
			{groupedItems.map((item) => {
				if (typeof item === "number") {
					return (
						<ExRTab0OptionRow
							key={item}
							uniqueOptionId={item}
							categoryId={categoryId}
						/>
					);
				}
				return (
					<ExRTab0OptionPairRow
						key={`pair-${item.baseName}`}
						baseName={item.baseName}
						minUniqueId={item.minData.uniqueOptionId}
						maxUniqueId={item.maxData.uniqueOptionId}
						categoryId={categoryId}
					/>
				);
			})}
		</div>
	);
}
