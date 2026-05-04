import type { RoleAssignFilterSetUI } from "../../type";
import { RolePin } from "./RolePin";

/**
 * フィルターセットをカード形式で表示するコンポーネント
 */
export function RoleFilterCard({
	guid,
	filterSet,
}: {
	guid: string;
	filterSet: RoleAssignFilterSetUI;
}) {
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
				{filterSet.Roles.map((role) => (
					<RolePin key={role.id} id={role.id} name={role.name} />
				))}
				{filterSet.Roles.length === 0 && (
					<span className="text-sm text-gray-400 italic">
						No roles selected
					</span>
				)}
			</div>
		</div>
	);
}
