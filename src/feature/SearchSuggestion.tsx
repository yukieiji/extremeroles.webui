import { PopoverHeader, PopoverTitle } from "@/components/ui/popover";
import type { SearchItem } from "@/type";
import { SearchSuggestionResult } from "./SearchSuggestionResult";

interface SearchSuggestionProps {
	results: SearchItem[];
	selectedIndex: number;
	onSelect: (item: SearchItem) => void;
}

export function SearchSuggestion({
	results,
	selectedIndex,
	onSelect,
}: SearchSuggestionProps) {
	return results.length === 0 ? (
		<PopoverHeader className="p-2">
			<PopoverTitle>Search No Results</PopoverTitle>
		</PopoverHeader>
	) : (
		<SearchSuggestionResult
			results={results}
			selectedIndex={selectedIndex}
			onSelect={onSelect}
		/>
	);
}
