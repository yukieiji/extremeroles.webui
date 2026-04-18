import { OptionItem } from "../components/parts/OptionItem";
import { OptionNameDisplay } from "../components/parts/OptionNameDisplay";
import { OptionRowContainer } from "../components/parts/OptionRowContainer";
import { exrOptionMetaData } from "../logics/api";
import { ExROptionControl } from "./ExROptionControl";

interface ExROptionRowProps {
	uniqueOptionId: number;
	depth?: number;
	isLeaf?: boolean;
}

/**
 * オプションの名前とコントロールを1行で表示するコンポーネント
 */
export function ExROptionRow({
	uniqueOptionId,
	depth = 0,
	isLeaf = false,
}: ExROptionRowProps) {
	const optionData = exrOptionMetaData.optionMetaData[uniqueOptionId];
	if (!optionData) {
		return null;
	}

	const content = (
		<OptionItem className="min-h-12">
			<div className="flex-1 min-w-0">
				<span className="text-sm font-medium text-gray-200 wrap-break-words">
					<OptionNameDisplay name={optionData.translatedName} />
				</span>
			</div>
			<div className="shrink-0 flex items-center gap-2">
				<ExROptionControl
					uniqueOptionId={uniqueOptionId}
					format={optionData.format}
					type={optionData.type}
				/>
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
