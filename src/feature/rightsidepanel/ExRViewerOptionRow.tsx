import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useExRNavigation } from "../../hooks/useExRNavigation";
import { useOptionData } from "../../hooks/useOptionData";
import { exrOptionMetaData } from "../../logics/api";
import {
	getBaseOptionName,
	getOptionLabel,
	isPresetOption,
	parseUniqueOptionId,
} from "../../logics/optionUtils";
import type { UniqueOptionId } from "../../type";
import { useStore } from "../../useStore";
import { AuTab0OptionValue } from "./AuTab0OptionValue";

interface ExRViewerOptionRowProps {
	uniqueOptionId: UniqueOptionId;
}

/**
 * ExRの各設定項目の行コンポーネント
 */
export function ExRViewerOptionRow({ uniqueOptionId }: ExRViewerOptionRowProps) {
	const optionValue = useOptionData(uniqueOptionId);
	const { navigateToExROption } = useExRNavigation();
	const presetNames = useStore((state) => state.presetNames);

	const optionMetaDetail = exrOptionMetaData.options[uniqueOptionId];
	if (!optionMetaDetail) {
		return null;
	}

	const { tabId, categoryId, optionId } = parseUniqueOptionId(uniqueOptionId);
	const { metaData } = optionMetaDetail;

	const selection = optionValue.selection ?? 0;
	let valueDisplay = optionValue.values[selection];

	// プリセットの場合の特殊処理
	if (isPresetOption(categoryId, optionId)) {
		valueDisplay = presetNames[selection] ?? valueDisplay.toString();
	}

	return (
		<div className="border-white border-b">
			<ViewerOptionRow
				title={metaData.translatedName}
				value={
					<AuTab0OptionValue value={valueDisplay} format={metaData.format} />
				}
				onDoubleClick={() => {
					navigateToExROption(tabId, categoryId, uniqueOptionId);
				}}
				testId={`right-panel-exr-option-${uniqueOptionId}`}
			/>
		</div>
	);
}

interface ExRViewerMinMaxRowProps {
	baseName: string;
	minUniqueId: UniqueOptionId;
	maxUniqueId: UniqueOptionId;
}

export function ExRViewerMinMaxRow({
	baseName,
	minUniqueId,
	maxUniqueId,
}: ExRViewerMinMaxRowProps) {
	const minOptionValue = useOptionData(minUniqueId);
	const maxOptionValue = useOptionData(maxUniqueId);
	const { navigateToExROption } = useExRNavigation();

	const minMeta = exrOptionMetaData.options[minUniqueId]?.metaData;
	const maxMeta = exrOptionMetaData.options[maxUniqueId]?.metaData;

	if (!minMeta || !maxMeta) {
		return null;
	}

	const { tabId, categoryId } = parseUniqueOptionId(minUniqueId);

	const minVal = minOptionValue.values[minOptionValue.selection ?? 0];
	const maxVal = maxOptionValue.values[maxOptionValue.selection ?? 0];

	return (
		<div className="border-white border-b">
			<ViewerOptionRow
				title={baseName}
				value={
					<div className="flex items-center gap-1">
						<AuTab0OptionValue value={minVal} format={minMeta.format} />
						<span className="text-gray-500">-</span>
						<AuTab0OptionValue value={maxVal} format={maxMeta.format} />
					</div>
				}
				onDoubleClick={() => {
					navigateToExROption(tabId, categoryId, minUniqueId);
				}}
				testId={`right-panel-exr-minmax-${minUniqueId}`}
			/>
		</div>
	);
}
