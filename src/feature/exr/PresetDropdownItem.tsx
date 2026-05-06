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
		<button
			type="button"
			onClick={() => {
				onSelect(index, name);
			}}
			className={`
        w-full text-left px-3 py-2 text-sm transition-colors
        ${isSelected ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"}
      `}
		>
			<div className="flex justify-between items-center">
				<span>{name}</span>
				{name !== String(value) && (
					<span className="text-xs opacity-50 ml-2">({value})</span>
				)}
			</div>
		</button>
	);
}
