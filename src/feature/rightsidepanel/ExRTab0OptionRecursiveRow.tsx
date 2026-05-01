import { useShallow } from "zustand/react/shallow";
import { RightPanelContainer } from "../../components/blocks/RightPanelContainer";
import { exrOptionMetaData } from "../../logics/api";
import type { UniqueOptionId } from "../../type";
import { useStore } from "../../useStore";
import { ExRTab0OptionItem } from "./ExRTab0OptionItem";
import { ExRTab0OptionRow } from "./ExRTab0OptionRow";

interface ExRTab0OptionRecursiveRowProps {
	uniqueOptionId: UniqueOptionId;
	depth?: number;
}

/**
 * 子・孫オプションを再帰的に表示するコンポーネント
 */
export function ExRTab0OptionRecursiveRow({
	uniqueOptionId,
	depth = 0,
}: ExRTab0OptionRecursiveRowProps) {
	const childIds = exrOptionMetaData.options[uniqueOptionId]?.childOptionIds;
	const activeChildIds = useStore(
		useShallow((state) => {
			if (!childIds) {
				return [];
			}
			return childIds.filter((id) => state.isExROptionActive[id]);
		}),
	);

	return (
		<div className="flex flex-col">
			<ExRTab0OptionRow uniqueOptionId={uniqueOptionId} />
			{activeChildIds.length > 0 && (
				<div className="pl-3 border-l border-gray-100 ml-1 mt-1 flex flex-col gap-1">
					<RightPanelContainer arr={activeChildIds}>
						{(childId) => (
							<ExRTab0OptionItem uniqueOptionId={childId} depth={depth + 1} />
						)}
					</RightPanelContainer>
				</div>
			)}
		</div>
	);
}
