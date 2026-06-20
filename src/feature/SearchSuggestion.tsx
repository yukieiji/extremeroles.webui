import { PopoverHeader, PopoverTitle } from "@/components/ui/popover";
import { SEARCH_NO_RESULTS } from "@/noTrans";
import type { SearchItem } from "@/type";
import { useStore } from "@/useStore";
import { SearchSuggestionResult } from "./SearchSuggestionResult";

interface SearchSuggestionProps {
	results: SearchItem[];
}

export function SearchSuggestion({ results }: SearchSuggestionProps) {
	const optionSearchQuery = useStore((state) => state.optionSearchQuery.trim());

	return optionSearchQuery === "" || results.length === 0 ? (
		<PopoverHeader className="">
			<PopoverTitle>{SEARCH_NO_RESULTS}</PopoverTitle>
		</PopoverHeader>
	) : (
		<SearchSuggestionResult results={results} />
	);
}
