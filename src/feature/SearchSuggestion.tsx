import { useShallow } from "zustand/react/shallow";
import {
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
} from "@/components/ui/popover";
import {
	useAuOptionNavigationInline,
	useExROptionNavigationInline,
} from "@/hooks/useOptionNavigation";
import { globalSearchItems } from "@/logics/api";
import type { SearchItem } from "@/type";
import { useStore } from "@/useStore";

export function SearchSuggestion() {
	const _results = useStore(
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

	const navigateToExR = useExROptionNavigationInline();
	const navigateToAu = useAuOptionNavigationInline();
	const setIsOpen = useStore((state) => state.setSuggestOpen);
	const optionSearchQuery = useStore((state) => state.optionSearchQuery);

	const _handleSelect = (item: SearchItem) => {
		if (item.info.mode === "exr-opt") {
			navigateToExR(item.info.uniqueOptionId);
		} else if (item.info.mode === "au-opt") {
			navigateToAu(item.info.tabId, item.info.categoryId, item.info.auOptionId);
		}
		setIsOpen(false);
	};

	return (
		<PopoverHeader>
			<PopoverTitle>Search Results</PopoverTitle>
			<PopoverDescription>
				Query:{" "}
				<span data-testid="search-query-display">{optionSearchQuery}</span>
			</PopoverDescription>
		</PopoverHeader>
	);
}
