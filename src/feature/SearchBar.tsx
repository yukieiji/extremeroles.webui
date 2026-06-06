import { Search } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
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
import { globalSearchItems } from "@/logics/api";
import { OPTION_SEARCH_PLACEHOLDER } from "@/noTrans";
import type { SearchItem } from "@/type";
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

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.isComposing || !isOpen || results.length === 0) {
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
			const item = results[selectedIndex];
			if (item) {
				handleSelect(item);
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
							onKeyDown={handleKeyDown}
							onChange={(e) => {
								setQuery(e.target.value);
							}}
							value={optionSearchQuery}
						/>
					</InputGroup>
				}
			/>
			<PopoverContent className="min-w-64 w-full" align="start">
				<SearchSuggestion
					results={results}
					selectedIndex={selectedIndex}
					onSelect={handleSelect}
				/>
			</PopoverContent>
		</Popover>
	);
}
