import {
	useHasActiveOptionChild,
	useOptionActive,
} from "../../hooks/useExROptionData";
import type { UniqueOptionId } from "../../type";
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
	const hasActiveChildren = useHasActiveOptionChild(uniqueOptionId);
	return hasActiveChildren ? (
		<ExROptionRecursiveItem uniqueOptionId={uniqueOptionId} depth={depth} />
	) : (
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
