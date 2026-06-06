import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import {
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
	useAuOptionNavigationInline,
	useExROptionNavigationInline,
} from "@/hooks/useOptionNavigation";
import {
	auOptionMetaData,
	exrOptionMetaData,
	globalSearchItems,
} from "@/logics/api";
import { stripColorTags } from "@/logics/colorUtils";
import { parseUniqueOptionId } from "@/logics/optionUtils";
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

	const getMetadataText = (item: SearchItem) => {
		if (item.info.mode === "exr-opt") {
			const { categoryId } = parseUniqueOptionId(item.info.uniqueOptionId);
			const categoryName = exrOptionMetaData.categories[categoryId]?.name ?? "";
			const parentNames = item.info.parentUniqueOptionIds
				.map((id) => exrOptionMetaData.options[id]?.metaData.translatedName)
				.filter(Boolean)
				.reverse();
			return stripColorTags([categoryName, ...parentNames].join(" > "));
		}
		if (item.info.mode === "au-opt") {
			return stripColorTags(
				auOptionMetaData.categoryMetaData[item.info.categoryId]?.name ?? "",
			);
		}
		if (item.info.mode === "exr-cat") {
			return stripColorTags(
				exrOptionMetaData.tabs[item.info.tabId]?.name ?? "",
			);
		}
		if (item.info.mode === "au-cat") {
			return stripColorTags(auOptionMetaData.tabNames[item.info.tabId] ?? "");
		}
		return "";
	};

	return (
		<>
			<PopoverHeader>
				<PopoverTitle>Search Results</PopoverTitle>
				<PopoverDescription>
					Query:{" "}
					<span data-testid="search-query-display">{optionSearchQuery}</span>
				</PopoverDescription>
			</PopoverHeader>
			{_results.length > 0 && (
				<>
					<Separator className="my-2" />
					<div className="flex flex-col gap-1">
						{_results.map((item) => {
							const key =
								item.info.mode === "exr-opt"
									? `exr-opt-${item.info.uniqueOptionId}`
									: item.info.mode === "au-opt"
										? `au-opt-${item.info.auOptionId}`
										: item.info.mode === "exr-cat"
											? `exr-cat-${item.info.categoryId}`
											: `au-cat-${item.info.categoryId}`;

							return (
								<Button
									key={key}
									variant="ghost"
									size="sm"
									className="h-auto flex-col items-start px-2 py-1.5"
									onClick={() => _handleSelect(item)}
								>
									<span className="w-full text-left font-medium">
										{stripColorTags(item.term)}
									</span>
									<span className="w-full text-left text-muted-foreground text-xs">
										{getMetadataText(item)}
									</span>
								</Button>
							);
						})}
					</div>
				</>
			)}
		</>
	);
}
