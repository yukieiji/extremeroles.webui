import { RoleFilterCardLayout } from "../../components/blocks/RoleFilterCardLayout";
import { RolePin } from "../../components/parts/RolePin";
import { postRoleFilterUpdate, roleFilterMetaData } from "../../logics/api";
import type { RoleAssignFilterSetUI } from "../../type";
import { PostExRAssignOps } from "../../type";
import { useStore } from "../../useStore";

interface RoleFilterCardProps {
	guid: string;
	filterSet: RoleAssignFilterSetUI;
}

/**
 * フィルターセットをカード形式で表示するコンポーネント (ビジネスロジックを含む feature コンポーネント)
 */
export function RoleFilterCard({ guid, filterSet }: RoleFilterCardProps) {
	const openBlockDialog = useStore((state) => state.openBlockDialog);
	const deleteRoleFilter = useStore((state) => state.deleteRoleFilter);
	const removeRoleFromFilter = useStore((state) => state.removeRoleFromFilter);
	const addRoleToFilter = useStore((state) => state.addRoleToFilter);

	const onDeleteFilter = () => {
		openBlockDialog({
			type: "confirm",
			title: "フィルターの削除",
			message: "このフィルターを削除してもよろしいですか？",
			onConfirm: async () => {
				try {
					await postRoleFilterUpdate({
						Op: PostExRAssignOps.FilterDelete,
						FilterId: guid,
						MapRoleId: null,
					});
					deleteRoleFilter(guid);
				} catch (error) {
					console.error("Failed to delete role filter:", error);
				}
			},
		});
	};

	const onDeleteRole = (roleId: number, roleName: string) => {
		openBlockDialog({
			type: "confirm",
			title: "役職の削除",
			message: `役職「${roleName}」をフィルターから削除してもよろしいですか？`,
			onConfirm: async () => {
				try {
					await postRoleFilterUpdate({
						Op: PostExRAssignOps.FilterRoleDelete,
						FilterId: guid,
						MapRoleId: roleId,
					});
					removeRoleFromFilter(guid, roleId);
				} catch (error) {
					console.error("Failed to remove role from filter:", error);
				}
			},
		});
	};

	const onOpenRoleSelect = () => {
		openBlockDialog({
			type: "roleSelect",
			title: "役職の追加",
			searchQuery: "",
			excludeRoleIds: filterSet.Roles.map((r) => r.id),
			onSelect: async (roleId: number) => {
				try {
					await postRoleFilterUpdate({
						Op: PostExRAssignOps.FilterRoleAdd,
						FilterId: guid,
						MapRoleId: roleId,
					});

					const roleName =
						(roleFilterMetaData.NormalRoleId[roleId] as string) ||
						(roleFilterMetaData.CombinationId[roleId] as string) ||
						(roleFilterMetaData.GhostRoleId[roleId] as string) ||
						"Unknown Role";

					addRoleToFilter(guid, roleId, roleName);
				} catch (error) {
					console.error("Failed to add role to filter:", error);
				}
			},
		});
	};

	const header = (
		<>
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
		</>
	);

	return (
		<RoleFilterCardLayout guid={guid} onDelete={onDeleteFilter} header={header}>
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
				<span className="text-sm text-gray-400 italic">No roles selected</span>
			)}
		</RoleFilterCardLayout>
	);
}
