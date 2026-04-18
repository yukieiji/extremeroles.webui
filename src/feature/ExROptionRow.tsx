import { OptionItem } from "../components/parts/OptionItem";
import { OptionNameDisplay } from "../components/parts/OptionNameDisplay";
import { OptionRowContainer } from "../components/parts/OptionRowContainer";
import { exrOptionMetaData } from "../logics/api";
import { getUniqueOptionId } from "../logics/optionUtils";
import { useStore } from "../useStore";
import { ExROptionControl } from "./ExROptionControl";

interface ExROptionRowProps {
	categoryId: number;
	optionId: number;
	depth?: number;
	isLeaf?: boolean;
}

/**
 * オプションの名前とコントロールを1行で表示するコンポーネント
 */
export function ExROptionRow({
	categoryId,
	optionId,
	depth = 0,
	isLeaf = false,
}: ExROptionRowProps) {
	const selectedExRTabId = useStore((state) => {
		return state.selectedExRTabId;
	});
	const uniqueId = getUniqueOptionId(selectedExRTabId, categoryId, optionId);
	const meta = exrOptionMetaData.optionMetaData[uniqueId];

	const content = (
		<OptionItem className="min-h-[3rem]">
			<div className="flex-1 min-w-0">
				<span className="text-sm font-medium text-gray-200 break-words">
					<OptionNameDisplay name={meta?.translatedName ?? ""} />
				</span>
			</div>
			<div className="flex-shrink-0 flex items-center gap-2">
				<ExROptionControl categoryId={categoryId} optionId={optionId} />
			</div>
		</OptionItem>
	);

	if (!isLeaf) {
		return content;
	}

	return (
		<OptionRowContainer
			leading={<span className="text-gray-500 select-none text-xs">・</span>}
			content={content}
			className={depth > 0 ? "border-l-2 border-blue-500/30 ml-4" : ""}
		/>
	);
}
