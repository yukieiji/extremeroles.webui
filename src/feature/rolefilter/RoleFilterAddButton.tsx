import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postRoleFilterUpdate, roleFilterMetaData } from "@/logics/api";
import {
	ROLE_FILTER_ADD_BUTTON,
	ROLE_FILTER_ADD_TITLE,
	ROLE_FILTER_UNKNOWN_ROLE,
} from "@/noTrans";
import { PostExRAssignOps } from "@/type";
import { useStore } from "@/useStore";

interface RoleFilterAddButtonProps {
	className?: string;
	onClick?: () => void;
}

/**
 * フィルターを追加するためのボタンコンポーネント (ビジネスロジックを含む)
 */
export function RoleFilterAddButton({
	className,
	onClick,
}: RoleFilterAddButtonProps) {
	const addRoleFilter = useStore((state) => state.addRoleFilter);
	const addRoleToFilter = useStore((state) => state.addRoleToFilter);
	const openBlockDialog = useStore((state) => state.openBlockDialog);

	const onAddFilter = () => {
		openBlockDialog({
			type: "roleSelect",
			title: ROLE_FILTER_ADD_TITLE,
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
							ROLE_FILTER_UNKNOWN_ROLE;

						addRoleToFilter(guid, roleId, roleName);
					}
				} catch (error) {
					console.error("Failed to add role filter with role:", error);
				}
			},
		});
	};

	return (
		<Button onClick={onClick || onAddFilter} className={className}>
			<Plus size={20} className="mr-1" aria-hidden="true" />
			{ROLE_FILTER_ADD_BUTTON}
		</Button>
	);
}
