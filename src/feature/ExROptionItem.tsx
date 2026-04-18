import { exrOptionMetaData } from "../logics/api";
import { getUniqueOptionId } from "../logics/optionUtils";
import { useStore } from "../useStore";
import { ExROptionRecursiveItem } from "./ExROptionRecursiveItem";
import { ExROptionRow } from "./ExROptionRow";

interface ExROptionItemProps {
	categoryId: number;
	optionId: number;
	depth?: number;
}

/**
 * ExRオプションの個別の項目を表示・管理するエントリーポイント
 */
export function ExROptionItem({
	categoryId,
	optionId,
	depth = 0,
}: ExROptionItemProps) {
	const selectedExRTabId = useStore((state) => {
		return state.selectedExRTabId;
	});
	const uniqueId = getUniqueOptionId(selectedExRTabId, categoryId, optionId);
	const isActive = useStore((state) => {
		return state.isOptionActive[uniqueId];
	});

	if (!isActive) {
		return null;
	}

	const childOptionIds = exrOptionMetaData.childOptionMap[uniqueId] ?? [];
	const hasActiveChildren = childOptionIds.length > 0;

	if (hasActiveChildren) {
		return (
			<ExROptionRecursiveItem
				categoryId={categoryId}
				optionId={optionId}
				depth={depth}
			/>
		);
	}

	return (
		<ExROptionRow
			categoryId={categoryId}
			optionId={optionId}
			depth={depth}
			isLeaf={true}
		/>
	);
}
