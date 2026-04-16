import { OptionItem } from "../components/parts/OptionItem";
import { OptionNameDisplay } from "../components/parts/OptionNameDisplay";
import { OptionRowContainer } from "../components/parts/OptionRowContainer";
import { getUniqueOptionId } from "../logics/optionUtils";
import type { ExROptionDto } from "../type";
import { useStore } from "../useStore";
import { ExROptionControl } from "./ExROptionControl";

interface ExROptionRowProps {
	categoryId: number;
	option: ExROptionDto;
	depth?: number;
	isLeaf?: boolean;
}

/**
 * オプションの名前とコントロールを1行で表示するコンポーネント
 */
export function ExROptionRow({
	categoryId,
	option,
	depth = 0,
	isLeaf = false,
}: ExROptionRowProps) {
	const uniqueId = getUniqueOptionId(categoryId, option.Id);
	const isPending = useStore((state) => {
		return state.pendingExROptionIds[uniqueId] ?? false;
	});

	const content = (
		<OptionItem
			className={`min-h-[3rem] transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : ""}`}
		>
			<div className="flex-1 min-w-0">
				<span className="text-sm font-medium text-gray-200 break-words">
					<OptionNameDisplay name={option.TranslatedName} />
					{isPending && (
						<span className="ml-2 inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
					)}
				</span>
			</div>
			<div className="flex-shrink-0 flex items-center gap-2">
				<ExROptionControl categoryId={categoryId} option={option} />
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
