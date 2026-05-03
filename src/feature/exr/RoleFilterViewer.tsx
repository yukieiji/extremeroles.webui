import { useStore } from "../../useStore";
import { RoleFilterCard } from "./RoleFilterCard";

/**
 * Role Filter のデータをカード形式で表示するコンポーネント
 */
export function RoleFilterViewer() {
	const roleFilterList = useStore((state) => {
		return state.roleFilterList;
	});

	if (!roleFilterList) {
		return (
			<div className="p-4 bg-gray-100 rounded-md">
				<p className="text-gray-500">No role filter data available.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4 overflow-auto max-h-[calc(100vh-200px)]">
			{roleFilterList.map((filter) => (
				<RoleFilterCard key={filter.guid} filter={filter} />
			))}
		</div>
	);
}
