import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { exrOptionMetaData } from "../logics/api";
import type { UniqueOptionId } from "../type";
import { useStore } from "../useStore";
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
	const childs = exrOptionMetaData.options[uniqueOptionId]?.childOptionIds;
	const hasActiveChildren = useStore(
		useShallow((state) => {
			if (!childs) {
				return false;
			}
			return (
				childs.length > 0 && childs.some((id) => state.isExROptionActive[id])
			);
		}),
	);

	if (hasActiveChildren) {
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
	const isActive = useStore(
		useCallback(
			(state) => {
				return state.isExROptionActive[uniqueOptionId];
			},
			[uniqueOptionId],
		),
	);
	return isActive ? (
		<ExROptionItemInner uniqueOptionId={uniqueOptionId} depth={depth} />
	) : null;
}
