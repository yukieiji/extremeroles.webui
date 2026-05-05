import { Plus } from "lucide-react";
import { postRoleFilterUpdate, roleFilterMetaData } from "../../logics/api";
import { PostExRAssignOps } from "../../type";
import { useStore } from "../../useStore";
import { Button } from "@/components/ui/button";

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
			title: "フィルター追加: 役職の選択",
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
							"Unknown Role";

						addRoleToFilter(guid, roleId, roleName);
					}
				} catch (error) {
					console.error("Failed to add role filter with role:", error);
				}
			},
		});
	};

	return (
		<Button onClick={onAddFilter}>
			<Plus size={20} className="mr-1" aria-hidden="true" />
			フィルターを追加
		</Button>
	);
}
