import type { KeyboardEvent } from "react";
import {
	useAuOptionNavigationInline,
	useExROptionNavigationInline,
} from "@/hooks/useOptionNavigation";
import type { SearchItem } from "@/type";
import { useStore } from "@/useStore";

export function useSearchNavigation() {
	const results = useStore((state) => state.filteredResults);
	const selectedSuggestIndex = useStore((state) => state.selectedSuggestIndex);
	const setIsOpen = useStore((state) => state.setSuggestOpen);
	const selectNext = useStore((state) => state.selectNextSuggestion);
	const selectPrev = useStore((state) => state.selectPrevSuggestion);

	const navigateToExR = useExROptionNavigationInline();
	const navigateToAu = useAuOptionNavigationInline();

	const handleSelect = (item: SearchItem) => {
		if (item.info.mode === "exr-opt") {
			navigateToExR(item.info.uniqueOptionId);
			setIsOpen(false);
		} else if (item.info.mode === "au-opt") {
			navigateToAu(item.info.tabId, item.info.categoryId, item.info.auOptionId);
			setIsOpen(false);
		}
	};

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (results.length === 0) {
			return;
		}

		if (e.key === "ArrowDown") {
			e.preventDefault();
			selectNext();
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			selectPrev();
		} else if (e.key === "Enter") {
			if (selectedSuggestIndex >= 0 && selectedSuggestIndex < results.length) {
				e.preventDefault();
				handleSelect(results[selectedSuggestIndex]);
			}
		}
	};

	return {
		results,
		selectedSuggestIndex,
		handleSelect,
		onKeyDown,
	};
}
