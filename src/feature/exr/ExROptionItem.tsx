import { useHasActiveOptionChild } from "@/hooks/useExROptionData";
import type { UniqueOptionId } from "@/type";
import { ExROptionRecursiveItem } from "./ExROptionRecursiveItem";
import { ExROptionRow } from "./ExROptionRow";

/**
 * ExRオプションの個別の項目を表示・管理するエントリーポイント
 */

interface ExROptionItemProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
}

export function ExROptionItem({
	uniqueOptionId,
	depth = 0,
}: ExROptionItemProps) {
	const hasActiveChildren = useHasActiveOptionChild(uniqueOptionId);
	return hasActiveChildren ? (
		<ExROptionRecursiveItem uniqueOptionId={uniqueOptionId} depth={depth} />
	) : (
		<ExROptionRow uniqueOptionId={uniqueOptionId} depth={depth} isLeaf={true} />
	);
}
