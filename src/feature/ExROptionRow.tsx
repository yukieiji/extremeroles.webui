import { OptionRowContainer } from "../components/blocks/OptionRowContainer";
import { OptionItem } from "../components/parts/OptionItem";
import { OptionNameDisplay } from "../components/parts/OptionNameDisplay";
import type { ExROptionDto } from "../type";
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
	const content = (
		<OptionItem className="min-h-[3rem]">
			<div className="flex-1 min-w-0">
				<span className="text-sm font-medium text-gray-200 break-words">
					<OptionNameDisplay name={option.TranslatedName} />
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
