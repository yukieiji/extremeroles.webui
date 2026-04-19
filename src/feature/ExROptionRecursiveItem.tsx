import { OptionAccordion } from "../components/blocks/OptionAccordion";
import { exrOptionMetaData } from "../logics/api";
import type { UniqueOptionId } from "../type";
import { useStore } from "../useStore";
import { ExROptionItem } from "./ExROptionItem";
import { ExROptionRow } from "./ExROptionRow";

interface ExROptionRecursiveItemProps {
	uniqueOptionId: UniqueOptionId;
	depth: number;
}

/**
 * 子要素を持つオプションをアコーディオンとして表示するコンポーネント
 */
export function ExROptionRecursiveItem({
	uniqueOptionId,
	depth = 0,
}: ExROptionRecursiveItemProps) {
	const isOpen = useStore((state) => {
		return state.openedExROptionIds[uniqueOptionId];
	});
	const toggleExROption = useStore((state) => {
		return state.toggleExROption;
	});

	const handleToggle = () => {
		toggleExROption(uniqueOptionId);
	};

	const childs = exrOptionMetaData.childOptionMap[uniqueOptionId];

	return (
		<OptionAccordion
			optionItem={
				<ExROptionRow
					uniqueOptionId={uniqueOptionId}
					depth={depth}
					isLeaf={false}
				/>
			}
			isOpen={isOpen ?? false}
			onToggle={handleToggle}
			showArrow={true} // このコンポーネントが呼ばれている時点で子要素が存在するはずなので、常に矢印を表示
			className={depth > 0 ? "border-l-2 border-blue-500/30 ml-4" : ""}
		>
			<div className="flex flex-col">
				{childs?.map((childId) => (
					<ExROptionItem
						key={childId}
						uniqueOptionId={childId}
						depth={depth + 1}
					/>
				))}
			</div>
		</OptionAccordion>
	);
}
