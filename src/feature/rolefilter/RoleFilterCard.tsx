import { RoleFilterCardLayout } from "../../components/blocks/RoleFilterCardLayout";
import { RolePin } from "../../components/parts/RolePin";
import { postRoleFilterUpdate } from "../../logics/api";
import type { RoleAssignFilterSetUI } from "../../type";
import { PostExRAssignOps } from "../../type";
import { useStore } from "../../useStore";
import { RoleFilterCardHeader } from "./RoleFilterCardHeader";

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
	return (
		<RoleFilterCardLayout
			onDelete={onDeleteFilter}
			header={
				<RoleFilterCardHeader
					guid={guid}
					assignNum={filterSet.AssignNum}
					excludeRoleIds={filterSet.Roles.map((r) => r.id)}
				/>
			}
		>
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
