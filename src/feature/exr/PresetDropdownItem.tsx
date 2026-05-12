import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "@/useStore";

interface PresetDropdownItemProps {
	index: number;
	value: number;
	isSelected: boolean;
	onSelect: (index: number, name: string) => void;
}

/**
 * ドロップダウン内の各プリセット項目を表示するコンポーネント。
 * 特定のインデックスの名前のみを購読することでパフォーマンスを最適化しています。
 */
export function PresetDropdownItem({
	index,
	value,
	isSelected,
	onSelect,
}: PresetDropdownItemProps) {
	const name = useStore((state) => {
		return state.presetNames[index] ?? String(value);
	});

	return (
		<Button
			variant="ghost"
			className={cn(
				"w-full justify-start font-normal px-2 py-1.5 h-auto",
				isSelected && "bg-accent text-accent-foreground",
			)}
			onClick={() => {
				onSelect(index, name);
			}}
		>
			<div className="flex w-full justify-between items-center">
				<div className="flex items-center gap-2">
					<Check
						className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
					/>
					<span>{name}</span>
				</div>
				{name !== String(value) && (
					<span className="text-xs opacity-50 ml-2">({value})</span>
				)}
			</div>
		</Button>
	);
}
