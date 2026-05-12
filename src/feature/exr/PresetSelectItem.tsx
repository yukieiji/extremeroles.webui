import { SelectItem } from "@/components/ui/select";
import { useStore } from "@/useStore";

interface PresetSelectItemProps {
	index: number;
	value: number;
}

/**
 * プリセットの各項目を表示するためのコンポーネント。
 * 特定のインデックスのプリセット名のみを監視します。
 */
export function PresetSelectItem({ index, value }: PresetSelectItemProps) {
	const name = useStore((state) => state.presetNames[index] ?? String(value));

	return (
		<SelectItem value={String(index)}>
			<div className="flex w-full items-center justify-between gap-2">
				<span>{name}</span>
				{name !== String(value) && (
					<span className="text-xs opacity-50">({value})</span>
				)}
			</div>
		</SelectItem>
	);
}
