import { Fragment } from "react";
import { SearchParentData } from "@/components/blocks/SearchParentData";
import { ColoredText } from "@/components/parts/ColoredText";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Separator } from "@/components/ui/separator";
import { useSearchSelection } from "@/hooks/useSearchSelection";
import { cn } from "@/lib/utils";
import type { SearchItem } from "@/type";
import { useStore } from "@/useStore";

interface SearchSuggestionResultProps {
	results: SearchItem[];
}

function getKeyByMode(item: SearchItem) {
	if (item.info.mode === "exr-opt") {
		return `exr-${item.info.uniqueOptionId}`;
	} else if (item.info.mode === "au-opt") {
		return `au-${item.info.tabId}-${item.info.categoryId}-${item.info.auOptionId}`;
	} else if (item.info.mode === "au-cat") {
		return `au-cat-${item.info.tabId}-${item.info.categoryId}`;
	} else if (item.info.mode === "exr-cat") {
		return `exr-cat-${item.info.categoryId}`;
	}
}

export function SearchSuggestionResult({
	results,
}: SearchSuggestionResultProps) {
	const handleSelect = useSearchSelection();
	const selectedIndex = useStore((state) => state.selectedSuggestIndex);
	const actualIndex =
		results.length > 0 && selectedIndex < results.length ? selectedIndex : 0;

	return (
		<ButtonGroup orientation="vertical" className="w-full">
			{results.map((item, index) => (
				<Fragment key={getKeyByMode(item)}>
					<Button
						className={cn(
							"h-auto w-full min-w-0 flex-col items-start justify-start text-left hover:bg-component-hover p-1 px-2",
							index === actualIndex && "bg-component-hover text-text-primary",
						)}
						variant="ghost"
						data-selected={index === actualIndex}
						onClick={() => handleSelect(item)}
					>
						<div className="w-full min-w-0 truncate">
							<ColoredText text={item.term} />
						</div>
						<SearchParentData parentData={item.parentData} />
					</Button>
					{index < results.length - 1 && <Separator />}
				</Fragment>
			))}
		</ButtonGroup>
	);
}
