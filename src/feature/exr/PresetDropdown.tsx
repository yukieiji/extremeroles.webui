import { SelectContent } from "@/components/ui/select";
import { PresetDropdownItem } from "./PresetDropdownItem";

interface PresetDropdownProps {
	presetValues: number[];
}

/**
 * プリセットの選択肢を表示するドロップダウンリストコンポーネント
 */
export function PresetDropdown({ presetValues }: PresetDropdownProps) {
	return (
		<SelectContent alignItemWithTrigger={false} align="end" className="w-46">
			{presetValues.map((val, index) => {
				return (
					<PresetDropdownItem key={`preset-${val}`} index={index} value={val} />
				);
			})}
		</SelectContent>
	);
}
