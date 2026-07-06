import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	postRoleFilterUpdate,
	roleFilterMetaData,
	translationMetaData,
} from "@/logics/api";
import { PostExRAssignOps } from "@/type";
import { useStore } from "@/useStore";

/**
 * フィルターを追加するためのボタンコンポーネント (ビジネスロジックを含む)
 */
export function RoleFilterAddButton() {
	const addRoleFilter = useStore((state) => state.addRoleFilter);
	const addRoleToFilter = useStore((state) => state.addRoleToFilter);
	const openBlockDialog = useStore((state) => state.openBlockDialog);

	const onAddFilter = () => {
		openBlockDialog({
			type: "roleSelect",
			title: translationMetaData.ROLE_FILTER_ADD_TITLE,
			searchQuery: "",
			excludeRoleIds: [],
			selectedRoleIds: [],
			lastClickedId: null,
			onSelect: async (roleIds: number[]) => {
				const guid = crypto.randomUUID();
				try {
					// 1. フィルターの新規作成
					await postRoleFilterUpdate({
						Op: PostExRAssignOps.FilterNewAdd,
						FilterId: guid,
						MapRoleId: null,
					});
					addRoleFilter(guid);

					// 2. 選択された役職をフィルターに追加
					for (const roleId of roleIds) {
						await postRoleFilterUpdate({
							Op: PostExRAssignOps.FilterRoleAdd,
							FilterId: guid,
							MapRoleId: roleId,
						});

						const roleName =
							(roleFilterMetaData.NormalRoleId[roleId] as string) ||
							(roleFilterMetaData.CombinationId[roleId] as string) ||
							(roleFilterMetaData.GhostRoleId[roleId] as string) ||
							"MISSING_ROLE";

						addRoleToFilter(guid, roleId, roleName);
					}
				} catch (error) {
					console.error("Failed to add role filter with role:", error);
				}
			},
		});
	};

	return (
		<Button onClick={onAddFilter} className="text-text-primary">
			<Plus size={20} className="" aria-hidden="true" />
			{translationMetaData.RoleAssignFilterAddFilter}
		</Button>
	);
}
