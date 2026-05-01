import { useShallow } from "zustand/react/shallow";
import { useExROptionActive } from "../../hooks/useExROptionActive";
import { exrOptionMetaData } from "../../logics/api";
import type { UniqueOptionId } from "../../type";
import { useStore } from "../../useStore";
import { ExRTab0OptionRecursiveRow } from "./ExRTab0OptionRecursiveRow";
import { ExRTab0OptionRow } from "./ExRTab0OptionRow";

interface ExRTab0OptionItemProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
}

/**
 * ExRオプションの表示単位を制御するコンポーネント（再帰か単一行か）
 */
export function ExRTab0OptionItem({
	uniqueOptionId,
	depth = 0,
}: ExRTab0OptionItemProps) {
	const isActive = useExROptionActive(uniqueOptionId);
	const childIds = exrOptionMetaData.options[uniqueOptionId]?.childOptionIds;
	const hasActiveChildren = useStore(
		useShallow((state) => {
			if (!childIds) {
				return false;
			}
			return (
				childIds.length > 0 &&
				childIds.some((id) => state.isExROptionActive[id])
			);
		}),
	);

	if (!isActive) {
		return null;
	}

	if (hasActiveChildren) {
		return (
			<ExRTab0OptionRecursiveRow
				uniqueOptionId={uniqueOptionId}
				depth={depth}
			/>
		);
	}

	return <ExRTab0OptionRow uniqueOptionId={uniqueOptionId} />;
}
