import { ColoredText } from "../../components/parts/ColoredText";
import { OptionFormat } from "../../components/parts/OptionFormat";
import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { auOptionMetaData, translationMetaData } from "../../logics/api";
import type { AuOptionId } from "../../type";
import { useStore } from "../../useStore";

/**
 * 各設定項目の行コンポーネント
 */
export function AuTab0OptionRow({
	optionId,
	categoryId,
}: { optionId: AuOptionId; categoryId: number }) {
	const setSelectedTab = useStore((state) => state.setSelectedTab);
	const setSelectedAuTabId = useStore((state) => state.setSelectedAuTabId);
	const toggleAuCategory = useStore((state) => state.toggleAuCategory);
	const openedAuCategoryIds = useStore((state) => state.openedAuCategoryIds);
	const setHighlightedAuOptionId = useStore(
		(state) => state.setHighlightedAuOptionId,
	);
	const auValue = useStore((state) => state.auValue);
	const setRightPanelOpen = useStore((state) => state.setRightPanelOpen);

	const optionMeta = auOptionMetaData.options[optionId];
	if (!optionMeta) return null;

	const selection = auValue[optionId] ?? 0;
	const value = optionMeta.range[selection];
	const isBoolean = typeof value === "boolean";

	const handleDoubleClick = () => {
		setRightPanelOpen(false);
		setSelectedTab("Au");
		setSelectedAuTabId(0);
		if (!openedAuCategoryIds[categoryId]) {
			toggleAuCategory(categoryId);
		}
		setHighlightedAuOptionId(optionId);

		setTimeout(() => {
			const element = document.getElementById(`au-option-${optionId}`);
			if (element) {
				element.scrollIntoView({ behavior: "smooth", block: "center" });
			}
			setTimeout(() => {
				setHighlightedAuOptionId(null);
			}, 2000);
		}, 100);
	};

	const valueDisplay = (
		<div className="flex items-center gap-1 shrink-0">
			<span className="text-xs text-blue-400 font-medium text-right">
				{isBoolean ? (
					<ColoredText
						text={
							translationMetaData.booleanTransData[value ? 1 : 0] ||
							(value ? "ON" : "OFF")
						}
					/>
				) : (
					value.toString()
				)}
			</span>
			{!isBoolean && (
				<div className="text-[10px] scale-90 origin-right">
					<OptionFormat format={optionMeta.format} />
				</div>
			)}
		</div>
	);

	return (
		<ViewerOptionRow
			title={optionMeta.title}
			value={valueDisplay}
			onDoubleClick={handleDoubleClick}
			testId={`right-panel-option-${optionId}`}
		/>
	);
}
