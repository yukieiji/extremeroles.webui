import { BorderLine } from "@/components/parts/BorderLine";
import {
	useHasActiveOptionChild,
	useOptionActive,
} from "@/hooks/useExROptionData";
import type { UniqueOptionId } from "@/type";
import { ExROptionRecursiveItem } from "./ExROptionRecursiveItem";
import { ExROptionRow } from "./ExROptionRow";

/**
 * ExRオプションの個別の項目を表示・管理するエントリーポイント
 */

interface ExROptionItemProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
	withBorder?: boolean;
}

function ExROptionItemInner({
	uniqueOptionId,
	depth = 0,
	withBorder = false,
}: ExROptionItemProps) {
	const hasActiveChildren = useHasActiveOptionChild(uniqueOptionId);
	return (
		<>
			{withBorder && <BorderLine depth={depth} />}
			{hasActiveChildren ? (
				<ExROptionRecursiveItem uniqueOptionId={uniqueOptionId} depth={depth} />
			) : (
				<ExROptionRow
					uniqueOptionId={uniqueOptionId}
					depth={depth}
					isLeaf={true}
				/>
			)}
		</>
	);
}

export function ExROptionItem({
	uniqueOptionId,
	depth = 0,
	withBorder = false,
}: ExROptionItemProps) {
	const isActive = useOptionActive(uniqueOptionId);
	return isActive ? (
		<ExROptionItemInner
			uniqueOptionId={uniqueOptionId}
			depth={depth}
			withBorder={withBorder}
		/>
	) : null;
}
