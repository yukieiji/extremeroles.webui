import { Search } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { useStore } from "@/useStore";
import { OptionSearchSuggestion } from "./OptionSearchSuggestion";

/**
 * オプションを検索する検索バーコンポーネント
 */
export function OptionSearchBar() {
	const query = useStore((state) => state.optionSearchQuery);
	const setQuery = useStore((state) => state.setOptionSearchQuery);

	return (
		<div className="flex items-center gap-2 w-64 shrink-0">
			<InputGroup className="flex-1">
				<InputGroupAddon align="inline-start">
					<Search className="size-4" />
				</InputGroupAddon>
				<InputGroupInput
					placeholder="オプションを検索..."
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
					}}
				/>
			</InputGroup>

			<OptionSearchSuggestion />
		</div>
	);
}
