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
	Separator?: React.ComponentType<{
		className?: string;
		depth?: number;
	}>;
}

function ExROptionItemInner({
	uniqueOptionId,
	depth = 0,
	withBorder = false,
	Separator = BorderLine,
}: ExROptionItemProps) {
	const hasActiveChildren = useHasActiveOptionChild(uniqueOptionId);
	return (
		<>
			{withBorder && <Separator className="first:hidden" depth={depth} />}
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
	Separator = BorderLine,
}: ExROptionItemProps) {
	const isActive = useOptionActive(uniqueOptionId);
	return isActive ? (
		<ExROptionItemInner
			uniqueOptionId={uniqueOptionId}
			depth={depth}
			withBorder={withBorder}
			Separator={Separator}
		/>
	) : null;
}
