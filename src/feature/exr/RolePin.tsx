/**
 * 個別の役職をピン形式で表示するコンポーネント
 */
export function RolePin({ id, name }: { id: number; name: string }) {
	return (
		<div
			data-role-id={id}
			className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
		>
			{name}
		</div>
	);
}
