import { useStore } from "../../useStore";

/**
 * Role Filter のデータをJSON形式で表示するコンポーネント
 */
export function RoleFilterViewer() {
	const roleFilterData = useStore((state) => {
		return state.roleFilterData;
	});

	if (!roleFilterData) {
		return (
			<div className="p-4 bg-gray-100 rounded-md">
				<p className="text-gray-500">No role filter data available.</p>
			</div>
		);
	}

	return (
		<div className="p-4 bg-gray-900 text-green-400 rounded-md overflow-auto font-mono text-sm max-h-[calc(100vh-200px)]">
			<pre>{JSON.stringify(roleFilterData, null, 2)}</pre>
		</div>
	);
}
