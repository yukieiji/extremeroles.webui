import { SelectItem } from "@/components/ui/select";
import { useStore } from "@/useStore";

interface PresetDropdownItemProps {
	index: number;
	value: number;
}

/**
 * ドロップダウン内の各プリセット項目を表示するコンポーネント。
 * 特定のインデックスの名前のみを購読することでパフォーマンスを最適化しています。
 */
export function PresetDropdownItem({ index, value }: PresetDropdownItemProps) {
	const name = useStore((state) => {
		return state.presetNames[index] ?? String(value);
	});

	return (
		<SelectItem value={String(index)}>
			<div className="flex justify-between items-center w-full">
				<span>{name}</span>
				{name !== String(value) && (
					<span className="text-xs opacity-50 ml-2">({value})</span>
				)}
			</div>
		</SelectItem>
	);
}
