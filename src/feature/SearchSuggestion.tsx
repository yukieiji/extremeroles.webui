import { PopoverHeader, PopoverTitle } from "@/components/ui/popover";
import { useStore } from "@/useStore";
import { SearchSuggestionResult } from "./SearchSuggestionResult";

export function SearchSuggestion() {
	const results = useStore((state) => state.filteredResults);
	const optionSearchQuery = useStore((state) => state.optionSearchQuery.trim());

	return optionSearchQuery === "" || results.length === 0 ? (
		<PopoverHeader className="p-2">
			<PopoverTitle>Search No Results</PopoverTitle>
		</PopoverHeader>
	) : (
		<SearchSuggestionResult results={results} />
	);
}
