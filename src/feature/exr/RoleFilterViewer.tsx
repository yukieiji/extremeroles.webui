import type { RoleAssignFilterSetDto } from "../../type";
import { useStore } from "../../useStore";

/**
 * 個別の役職をピン形式で表示するコンポーネント
 */
function RolePin({ id, name }: { id: number; name: string }) {
	return (
		<div
			data-role-id={id}
			className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
		>
			{name}
		</div>
	);
}

/**
 * フィルターセットをカード形式で表示するコンポーネント
 */
function RoleFilterCard({
	guid,
	filterSet,
}: {
	guid: string;
	filterSet: RoleAssignFilterSetDto;
}) {
	// 全ての役職を一つの配列にまとめる
	const allRoles = [
		...Object.entries(filterSet.FilterNormalId).map(([id, name]) => ({
			id: Number(id),
			name: String(name),
		})),
		...Object.entries(filterSet.FilterCombinationId).map(([id, name]) => ({
			id: Number(id),
			name: String(name),
		})),
		...Object.entries(filterSet.FilterGhostRoleId).map(([id, name]) => ({
			id: Number(id),
			name: String(name),
		})),
	];

	return (
		<div
			data-guid={guid}
			className="bg-white shadow rounded-lg p-4 border border-gray-200 flex flex-col gap-3"
		>
			<div className="flex justify-between items-center border-b border-gray-100 pb-2">
				<span className="text-sm font-semibold text-gray-700">
					AssignNum: {filterSet.AssignNum}
				</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{allRoles.map((role) => (
					<RolePin key={role.id} id={role.id} name={role.name} />
				))}
				{allRoles.length === 0 && (
					<span className="text-sm text-gray-400 italic">
						No roles selected
					</span>
				)}
			</div>
		</div>
	);
}

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
