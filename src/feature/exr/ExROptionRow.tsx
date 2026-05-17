import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { LargePoint } from "@/components/parts/LargePoint";
import { OptionRowContainer } from "@/components/parts/OptionRowContainer";
import { ExROptionRowContent } from "@/feature/exr/ExROptionRowContent";
import { createExRNavigateId } from "@/hooks/useOptionNavigation";
import type { UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";

interface ExROptionRowProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
	isLeaf?: boolean;
}

interface ExROptionRowInnerProps {
	uniqueOptionId: UniqueOptionId;
	depth: number;
}

/**
 * オプションの名前とコントロールを1行で表示するコンポーネント
 */
function ExROptionRowInner({ uniqueOptionId, depth }: ExROptionRowInnerProps) {
	const isHighlighted = useStore((state) => {
		return state.highlightedExROptionId === uniqueOptionId;
	});

	const navigateId = createExRNavigateId(uniqueOptionId);

	return (
		<HighlightWrapper
			id={navigateId}
			isHighlighted={isHighlighted}
			isInset={true}
		>
			<OptionRowContainer
				leading={<LargePoint />}
				content={<ExROptionRowContent uniqueOptionId={uniqueOptionId} />}
				depth={depth}
				indentMultiplier={1}
			/>
		</HighlightWrapper>
	);
}

export function ExROptionRow({
	uniqueOptionId,
	depth = 0,
	isLeaf = false,
}: ExROptionRowProps) {
	return isLeaf ? (
		<ExROptionRowInner uniqueOptionId={uniqueOptionId} depth={depth} />
	) : (
		<ExROptionRowContent uniqueOptionId={uniqueOptionId} />
	);
}
