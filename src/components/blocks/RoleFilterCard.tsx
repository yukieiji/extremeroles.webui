import {
	handleAddRoleToFilter,
	handleDeleteRoleFilter,
	handleRemoveRoleFromFilter,
} from "../../logics/api.store";
import type { RoleAssignFilterSetUI } from "../../type";
import { useStore } from "../../useStore";
import { RolePin } from "../parts/RolePin";

interface RoleFilterCardProps {
	guid: string;
	filterSet: RoleAssignFilterSetUI;
}

/**
 * フィルターセットをカード形式で表示するコンポーネント
 */
export function RoleFilterCard({ guid, filterSet }: RoleFilterCardProps) {
	const openBlockDialog = useStore((state) => state.openBlockDialog);

	const onDeleteFilter = () => {
		openBlockDialog({
			title: "フィルターの削除",
			message: "このフィルターを削除してもよろしいですか？",
			onConfirm: () => handleDeleteRoleFilter(guid),
		});
	};

	const onDeleteRole = (roleId: number, roleName: string) => {
		openBlockDialog({
			title: "役職の削除",
			message: `役職「${roleName}」をフィルターから削除してもよろしいですか？`,
			onConfirm: () => handleRemoveRoleFromFilter(guid, roleId),
		});
	};

	const onOpenRoleSelect = () => {
		openBlockDialog({
			title: "役職の追加",
			contentType: "roleSelect",
			contentProps: {
				excludeRoleIds: filterSet.Roles.map((r) => r.id),
				onSelect: (roleId: number) => handleAddRoleToFilter(guid, roleId),
			},
		});
	};

	return (
		<div
			data-guid={guid}
			className="bg-white shadow rounded-lg p-4 border border-gray-200 flex flex-col gap-3 relative"
		>
			<button
				type="button"
				onClick={onDeleteFilter}
				className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
				aria-label="Delete filter"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					role="img"
					aria-label="Delete icon"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>

			<div className="flex flex-col border-b border-gray-100 pb-2">
				<span className="text-sm font-semibold text-gray-700">
					AssignNum: {filterSet.AssignNum}
				</span>
				<button
					type="button"
					onClick={onOpenRoleSelect}
					className="mt-1 self-start inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-3 w-3 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						role="img"
						aria-label="Add icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
					役職を追加
				</button>
			</div>

			<div className="flex flex-wrap gap-2">
				{filterSet.Roles.map((role) => {
					return (
						<RolePin
							key={role.id}
							id={role.id}
							name={role.name}
							onDelete={() => onDeleteRole(role.id, role.name)}
						/>
					);
				})}
				{filterSet.Roles.length === 0 && (
					<span className="text-sm text-gray-400 italic">
						No roles selected
					</span>
				)}
			</div>
		</div>
	);
}
