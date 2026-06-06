import { Search } from "lucide-react";
import type React from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	useAuOptionNavigationInline,
	useExROptionNavigationInline,
} from "@/hooks/useOptionNavigation";
import { useSearchResults } from "@/hooks/useSearchResults";
import { OPTION_SEARCH_PLACEHOLDER } from "@/noTrans";
import { useStore } from "@/useStore";
import { SearchSuggestion } from "./SearchSuggestion";

/**
 * オプションやカテゴリをを検索するための検索バーコンポーネント。
 */
export function SearchBar() {
	const optionSearchQuery = useStore((state) => state.optionSearchQuery);
	const setQuery = useStore((state) => state.setOptionSearchQuery);
	const isOpen = useStore((state) => state.isSuggestOpen);
	const setIsOpen = useStore((state) => state.setSuggestOpen);
	const selectedIndex = useStore((state) => state.selectedSuggestIndex);
	const setSelectedIndex = useStore((state) => state.setSelectedSuggestIndex);

	const results = useSearchResults();
	const navigateToExR = useExROptionNavigationInline();
	const navigateToAu = useAuOptionNavigationInline();

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!isOpen || results.length === 0) {
			return;
		}

		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((selectedIndex + 1) % results.length);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((selectedIndex - 1 + results.length) % results.length);
		} else if (e.key === "Enter") {
			e.preventDefault();
			const selectedItem = results[selectedIndex];
			if (selectedItem) {
				if (selectedItem.info.mode === "exr-opt") {
					navigateToExR(selectedItem.info.uniqueOptionId);
					setIsOpen(false);
				} else if (selectedItem.info.mode === "au-opt") {
					navigateToAu(
						selectedItem.info.tabId,
						selectedItem.info.categoryId,
						selectedItem.info.auOptionId,
					);
					setIsOpen(false);
				}
			}
		}
	};

	return (
		<Popover
			open={isOpen}
			onOpenChange={(open, details) => {
				if (open) {
					setIsOpen(true);
				} else if (
					details.reason === "outside-press" ||
					details.reason === "escape-key" ||
					details.reason === "focus-out"
				) {
					setIsOpen(false);
				} else {
					// Prevent closing when clicking the input (trigger-press)
					details.cancel();
				}
			}}
		>
			<PopoverTrigger
				nativeButton={false}
				render={
					<InputGroup className="w-64">
						<InputGroupAddon align="inline-start">
							<Search className="size-4 text-muted-foreground" />
						</InputGroupAddon>
						<InputGroupInput
							placeholder={OPTION_SEARCH_PLACEHOLDER}
							type="search"
							className="flex-1"
							autoComplete="off"
							onFocus={() => {
								setIsOpen(true);
							}}
							onClick={(e) => {
								e.stopPropagation();
							}}
							onChange={(e) => {
								setQuery(e.target.value);
							}}
							onKeyDown={handleKeyDown}
							value={optionSearchQuery}
						/>
					</InputGroup>
				}
			/>
			<PopoverContent className="min-w-64 w-full" align="start">
				<SearchSuggestion results={results} />
			</PopoverContent>
		</Popover>
	);
}
