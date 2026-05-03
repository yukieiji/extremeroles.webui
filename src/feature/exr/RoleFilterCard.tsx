import { RolePin } from "../../components/parts/RolePin";
import type { RoleFilterItem } from "../../type";

interface RoleFilterCardProps {
	filter: RoleFilterItem;
}

/**
 * 各フィルター設定を表示するカードコンポーネント
 */
export function RoleFilterCard({ filter }: RoleFilterCardProps) {
	return (
		<div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
			<div className="flex items-center justify-between border-b border-gray-100 pb-3">
				<span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
					AssignNum
				</span>
				<span className="text-2xl font-bold text-gray-900">
					{filter.assignNum}
				</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{filter.roles.map((role) => (
					<RolePin key={`${role.type}-${role.id}`} name={role.name} />
				))}
			</div>
		</div>
	);
}
