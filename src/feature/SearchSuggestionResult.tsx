import { Fragment } from "react";
import { ColoredText } from "@/components/parts/ColoredText";
import { SearchParentData } from "@/components/parts/SearchParentData";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Separator } from "@/components/ui/separator";
import {
	useAuOptionNavigationInline,
	useExROptionNavigationInline,
} from "@/hooks/useOptionNavigation";
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
	const navigateToExR = useExROptionNavigationInline();
	const navigateToAu = useAuOptionNavigationInline();
	const setIsOpen = useStore((state) => state.setSuggestOpen);

	const handleSelect = (item: SearchItem) => {
		if (item.info.mode === "exr-opt") {
			navigateToExR(item.info.uniqueOptionId);
			setIsOpen(false);
		} else if (item.info.mode === "au-opt") {
			navigateToAu(item.info.tabId, item.info.categoryId, item.info.auOptionId);
			setIsOpen(false);
		}
	};

	return (
		<ButtonGroup orientation="vertical" className="w-full">
			{results.map((item, index) => (
				<Fragment key={getKeyByMode(item)}>
					<Button
						className="h-auto w-full min-w-0 flex-col items-start justify-start py-2"
						variant="ghost"
						onClick={() => handleSelect(item)}
					>
						<div className="w-full min-w-0 truncate text-left">
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
