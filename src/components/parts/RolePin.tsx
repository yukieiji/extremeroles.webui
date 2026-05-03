import { ColoredText } from "./ColoredText";

interface RolePinProps {
	name: string;
}

/**
 * 役職を表示するピン（バッジ）コンポーネント
 */
export function RolePin({ name }: RolePinProps) {
	return (
		<span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
			<ColoredText text={name} />
		</span>
	);
}
