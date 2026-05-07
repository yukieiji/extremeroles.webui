import { useEffect, useRef } from "react";
import { ExROptionRowContent } from "@/components/blocks/ExROptionRowContent";
import { HighlightableAccordionRow } from "@/components/blocks/HighlightableAccordionRow";
import { RowCustomizeAccordion } from "@/components/blocks/OptionEditableAccordion";
import { OptionEditorCategoryOptionLayout } from "@/components/blocks/OptionEditorCategoryOptionLayout";
import { HighlightWrapper } from "@/components/parts/HighlightWrapper";
import { LargePoint } from "@/components/parts/LargePoint";
import { OptionRowContainer } from "@/components/parts/OptionRowContainer";
import {
	useHasActiveOptionChild,
	useOptionActive,
} from "@/hooks/useExROptionData";
import { createExRNavigateId } from "@/hooks/useOptionNavigation";
import { exrOptionMetaData } from "@/logics/api";
import type { UniqueOptionId } from "@/type";
import { useStore } from "@/useStore";

/**
 * ExRオプションの個別の項目を表示・管理するエントリーポイント
 */

interface ExROptionItemProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
}

function ExROptionItemInner({ uniqueOptionId, depth = 0 }: ExROptionItemProps) {
	const hasActiveChildren = useHasActiveOptionChild(uniqueOptionId);
	const isOpen = useStore((state) => {
		return state.openedExROptionIds[uniqueOptionId] ?? false;
	});
	const toggleExROption = useStore((state) => {
		return state.toggleExROption;
	});
	const openExROptions = useStore((state) => {
		return state.openExROptions;
	});
	const isHighlighted = useStore((state) => {
		return state.highlightedExROptionId === uniqueOptionId;
	});

	const prevHasActiveChildrenRef = useRef(hasActiveChildren);

	useEffect(() => {
		// アコーディオンになった瞬間に自動的に展開する
		if (hasActiveChildren && !prevHasActiveChildrenRef.current) {
			openExROptions([uniqueOptionId]);
		}
		prevHasActiveChildrenRef.current = hasActiveChildren;
	}, [hasActiveChildren, openExROptions, uniqueOptionId]);

	const handleToggle = () => {
		toggleExROption(uniqueOptionId);
	};

	const navigateId = createExRNavigateId(uniqueOptionId);
	const childs =
		exrOptionMetaData.options[uniqueOptionId]?.childOptionIds ?? [];

	return (
		<RowCustomizeAccordion
			row={
				hasActiveChildren ? (
					<HighlightableAccordionRow
						id={navigateId}
						onToggle={handleToggle}
						isOpen={isOpen}
						isHighlight={isHighlighted}
					>
						<ExROptionRowContent uniqueOptionId={uniqueOptionId} />
					</HighlightableAccordionRow>
				) : (
					<HighlightWrapper
						id={navigateId}
						isHighlighted={isHighlighted}
						isInset={true}
					>
						<OptionRowContainer
							leading={<LargePoint />}
							content={<ExROptionRowContent uniqueOptionId={uniqueOptionId} />}
							className={depth > 0 ? "pl-4" : ""}
						/>
					</HighlightWrapper>
				)
			}
			isOpen={hasActiveChildren && isOpen}
			depth={depth}
		>
			<OptionEditorCategoryOptionLayout arr={childs} ignoreIndex={-1}>
				{(childId) => (
					<ExROptionItem uniqueOptionId={childId} depth={depth + 1} />
				)}
			</OptionEditorCategoryOptionLayout>
		</RowCustomizeAccordion>
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
