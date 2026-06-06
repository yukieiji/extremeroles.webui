import { useShallow } from "zustand/react/shallow";
import { PopoverHeader, PopoverTitle } from "@/components/ui/popover";
import { globalSearchItems } from "@/logics/api";
import { useStore } from "@/useStore";
import { SearchSuggestionResult } from "./SearchSuggestionResult";

export function SearchSuggestion() {
	const results = useStore(
		useShallow((state) => {
			if (state.optionSearchQuery.trim() === "") {
				return [];
			}
			const lowerQuery = state.optionSearchQuery.toLowerCase();
			return globalSearchItems
				.filter((item) => {
					if (!item.term.toLowerCase().includes(lowerQuery)) {
						return false;
					}
					return item.info.mode === "exr-opt"
						? (state.isExROptionActive[item.info.uniqueOptionId] ?? false)
						: true;
				})
				.slice(0, 10);
		}),
	);

	const optionSearchQuery = useStore((state) => state.optionSearchQuery.trim());

	return optionSearchQuery === "" || results.length === 0 ? (
		<PopoverHeader className="p-2">
			<PopoverTitle>Search No Results</PopoverTitle>
		</PopoverHeader>
	) : (
		<SearchSuggestionResult results={results} />
	);
}
