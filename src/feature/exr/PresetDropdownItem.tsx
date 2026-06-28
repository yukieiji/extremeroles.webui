import { SelectItem } from "@/components/ui/select";
import { TYPOGRAPHY } from "@/designConstants";
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
			<div className="flex justify-between items-center w-full pl-1">
				<span>{name}</span>
				{name !== String(value) && (
					<span className={`${TYPOGRAPHY.SMALL} text-text-secondar`}>
						({value})
					</span>
				)}
			</div>
		</SelectItem>
	);
}
