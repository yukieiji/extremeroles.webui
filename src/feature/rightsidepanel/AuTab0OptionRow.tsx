import { ViewerOptionRow } from "../../components/parts/ViewerOptionRow";
import { auOptionMetaData } from "../../logics/api";
import type { AuOptionId } from "../../type";
import { useStore } from "../../useStore";
import { AuTab0OptionValue } from "./AuTab0OptionValue";

interface AuTab0OptionRowProps {
	optionId: AuOptionId;
	categoryId: number;
}

/**
 * 各設定項目の行コンポーネント
 */
export function AuTab0OptionRow({
	optionId,
	categoryId,
}: AuTab0OptionRowProps) {
	const setSelectedTab = useStore((state) => {
		return state.setSelectedTab;
	});
	const setSelectedAuTabId = useStore((state) => {
		return state.setSelectedAuTabId;
	});
	const toggleAuCategory = useStore((state) => {
		return state.toggleAuCategory;
	});
	const openedAuCategoryIds = useStore((state) => {
		return state.openedAuCategoryIds;
	});
	const setHighlightedAuOptionId = useStore((state) => {
		return state.setHighlightedAuOptionId;
	});
	const auValue = useStore((state) => {
		return state.auValue;
	});
	const setRightPanelOpen = useStore((state) => {
		return state.setRightPanelOpen;
	});

	const optionMeta = auOptionMetaData.options[optionId];
	if (!optionMeta) {
		return null;
	}

	const selection = auValue[optionId] ?? 0;
	const value = optionMeta.range[selection];

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

	return (
		<ViewerOptionRow
			title={optionMeta.title}
			value={<AuTab0OptionValue value={value} format={optionMeta.format} />}
			onDoubleClick={handleDoubleClick}
			testId={`right-panel-option-${optionId}`}
		/>
	);
}
