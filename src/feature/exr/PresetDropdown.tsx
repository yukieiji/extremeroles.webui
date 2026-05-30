import { SelectContent } from "@/components/ui/select";
import { PresetDropdownItem } from "./PresetDropdownItem";

interface PresetDropdownProps {
	currentSelection: number;
	presetValues: number[];
}

/**
 * プリセットの選択肢を表示するドロップダウンリストコンポーネント（shadcn/UI SelectContent ベース）
 */
export function PresetDropdown({
	currentSelection,
	presetValues,
}: PresetDropdownProps) {
	return (
		<SelectContent align="start" className="max-h-60 overflow-y-auto">
			{presetValues.map((val, index) => {
				return (
					<PresetDropdownItem
						key={`preset-${val}`}
						index={index}
						value={val}
					/>
				);
			})}
		</SelectContent>
	);
}
