import { PopoverHeader, PopoverTitle } from "@/components/ui/popover";
import type { SearchItem } from "@/type";
import { useStore } from "@/useStore";
import { SearchSuggestionResult } from "./SearchSuggestionResult";

interface SearchSuggestionProps {
	results: SearchItem[];
	selectedIndex: number;
}

export function SearchSuggestion({
	results,
	selectedIndex,
}: SearchSuggestionProps) {
	const optionSearchQuery = useStore((state) => state.optionSearchQuery.trim());

	return optionSearchQuery === "" || results.length === 0 ? (
		<PopoverHeader className="p-2">
			<PopoverTitle>Search No Results</PopoverTitle>
		</PopoverHeader>
	) : (
		<SearchSuggestionResult results={results} selectedIndex={selectedIndex} />
	);
}
