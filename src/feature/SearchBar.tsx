import { Search } from "lucide-react";
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

	return (
		<Popover
			open={isOpen}
			onOpenChange={(open, details) => {
				if (open) {
					setIsOpen(true);
				} else {
					if (
						details.reason === "outside-press" ||
						details.reason === "escape-key" ||
						details.reason === "focus-out"
					) {
						setIsOpen(false);
					} else {
						// Prevent closing when clicking the input (trigger-press)
						details.cancel();
					}
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
							value={optionSearchQuery}
						/>
					</InputGroup>
				}
			/>
			<PopoverContent className="w-64" align="start" initialFocus={false}>
				<SearchSuggestion />
			</PopoverContent>
		</Popover>
	);
}
