import { useStore } from "../../useStore";
import { RoleFilterCard } from "./RoleFilterCard";

/**
 * Role Filter のデータをカード形式で表示するコンポーネント
 */
export function RoleFilterViewer() {
	const roleFilterSet = useStore((state) => {
		return state.roleFilterSet;
	});

	if (!roleFilterSet) {
		return (
			<div className="p-4 bg-gray-100 rounded-md">
				<p className="text-gray-500">No role filter data available.</p>
			</div>
		);
	}

	return (
		<div className="p-4 flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{Object.entries(roleFilterSet).map(([guid, filterSet]) => (
					<RoleFilterCard key={guid} guid={guid} filterSet={filterSet} />
				))}
			</div>
		</div>
	);
}
