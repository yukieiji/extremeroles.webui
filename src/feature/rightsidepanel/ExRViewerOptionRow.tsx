import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { useExRNavigation } from "../../hooks/useExRNavigation";
import { exrOptionMetaData } from "../../logics/api";
import { ExRTabId, type UniqueOptionId } from "../../type";
import { useStore } from "../../useStore";
import { ExRViewerOptionValue } from "./ExRViewerOptionValue";

interface ExRViewerOptionRowProps {
	uniqueOptionId: UniqueOptionId;
	categoryId: number;
}

/**
 * ExRの各設定項目の行コンポーネント（閲覧用）
 */
export function ExRViewerOptionRow({
	uniqueOptionId,
	categoryId,
}: ExRViewerOptionRowProps) {
	const exrValue = useStore((state) => state.exrValue[uniqueOptionId]);
	const isActive = useStore((state) => state.isExROptionActive[uniqueOptionId]);
	const { navigateToExROption } = useExRNavigation();

	const optionMeta = exrOptionMetaData.options[uniqueOptionId];
	if (!optionMeta || !isActive) {
		return null;
	}

	const selection = exrValue?.selection ?? 0;
	const value = exrValue?.values[selection];

	return (
		<div className="border-white border-b">
			<ViewerOptionRow
				title={optionMeta.metaData.translatedName}
				value={
					<ExRViewerOptionValue
						value={value}
						format={optionMeta.metaData.format}
					/>
				}
				onDoubleClick={() => {
					navigateToExROption(ExRTabId.GeneralTab, categoryId, uniqueOptionId);
				}}
				testId={`right-panel-exr-option-${uniqueOptionId}`}
			/>
		</div>
	);
}
