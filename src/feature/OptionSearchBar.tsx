import { Search } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { OPTION_SEARCH_PLACEHOLDER } from "@/noTrans";

/**
 * オプションを検索するための検索バーコンポーネント。
 * UIのみを提供し、メインのロジックはまだ実装されていません。
 */
export function OptionSearchBar() {
	return (
		<InputGroup className="w-64">
			<InputGroupAddon align="inline-start">
				<Search className="size-4 text-muted-foreground" />
			</InputGroupAddon>
			<InputGroupInput
				placeholder={OPTION_SEARCH_PLACEHOLDER}
				type="search"
				className="flex-1"
			/>
		</InputGroup>
	);
}
