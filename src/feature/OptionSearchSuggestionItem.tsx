import { SelectItem } from "@/components/ui/select";
import type { SearchItem } from "@/type";

interface OptionSearchSuggestionItemProps {
	item: SearchItem;
}

/**
 * 検索サジェストの各項目の内容を表示するコンポーネント
 */
export function OptionSearchSuggestionItem({
	item,
}: OptionSearchSuggestionItemProps) {
	const isAu = item.info.mode === "au-opt" || item.info.mode === "au-cat";
	const isOption = item.info.mode === "au-opt" || item.info.mode === "exr-opt";

	return (
		<SelectItem value={item.id}>
			<div className="flex flex-col text-left">
				<span className="font-medium text-sm">{item.term}</span>
				<span className="text-[10px] text-muted-foreground leading-tight">
					{isAu ? "Among Us" : "Extreme Roles"}
					{" - "}
					{isOption ? "オプション" : "カテゴリ"}
					{item.context && ` (${item.context})`}
				</span>
			</div>
		</SelectItem>
	);
}
