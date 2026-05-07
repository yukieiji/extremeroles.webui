import { useOptionActive } from "@/hooks/useExROptionData";
import { exrOptionMetaData } from "@/logics/api";
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

function ExROptionItemInner({ uniqueOptionId, depth = 0 }: ExROptionItemProps) {
	const canHaveChildren =
		(exrOptionMetaData.options[uniqueOptionId]?.childOptionIds.length ?? 0) > 0;

	if (canHaveChildren) {
		return (
			<ExROptionRecursiveItem uniqueOptionId={uniqueOptionId} depth={depth} />
		);
	}

	return (
		<ExROptionRow uniqueOptionId={uniqueOptionId} depth={depth} isLeaf={true} />
	);
}

export function ExROptionItem({
	uniqueOptionId,
	depth = 0,
}: ExROptionItemProps) {
	const isActive = useOptionActive(uniqueOptionId);
	return isActive ? (
		<ExROptionItemInner uniqueOptionId={uniqueOptionId} depth={depth} />
	) : null;
}
