import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { exrOptionMetaData } from "../logics/constants";
import { useStore } from "../useStore";
import { ExROptionRecursiveItem } from "./ExROptionRecursiveItem";
import { ExROptionRow } from "./ExROptionRow";

/**
 * ExRオプションの個別の項目を表示・管理するエントリーポイント
 */

interface ExROptionItem {
	uniqueOptionId: number;
	depth?: number;
}

function ExROptionItemInner({ uniqueOptionId, depth = 0 }: ExROptionItem) {
	const childs = exrOptionMetaData.childOptionMap[uniqueOptionId];
	const hasActiveChildren = useStore(
		useShallow((state) => {
			if (!childs) {
				return false;
			}
			return childs.length > 0 && childs.some((id) => state.isOptionActive[id]);
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

export function ExROptionItem({ uniqueOptionId, depth = 0 }: ExROptionItem) {
	const isActive = useStore(
		useCallback(
			(state) => {
				return state.isOptionActive[uniqueOptionId];
			},
			[uniqueOptionId],
		),
	);
	return isActive ? (
		<ExROptionItemInner uniqueOptionId={uniqueOptionId} depth={depth} />
	) : null;
}
