import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { TYPOGRAPHY } from "@/designConstants";
import {
	postRoleFilterUpdate,
	roleFilterMetaData,
	translationMetaData,
} from "@/logics/api";
import { format } from "@/logics/stringUtils";
import { PostExRAssignOps } from "@/type";
import { useStore } from "@/useStore";

interface RoleFilterCardHeaderProps {
	guid: string;
	assignNum: number;
	excludeRoleIds: number[];
}

export function RoleFilterCardHeader({
	guid,
	assignNum,
	excludeRoleIds,
}: RoleFilterCardHeaderProps) {
	const openBlockDialog = useStore((state) => state.openBlockDialog);
	const addRoleToFilter = useStore((state) => state.addRoleToFilter);
	const incrementAssignNum = useStore((state) => state.incrementAssignNum);
	const decrementAssignNum = useStore((state) => state.decrementAssignNum);
	const isUpdating = useStore((state) => state.isUpdatingAssignNum[guid]);
	const setIsUpdating = useStore((state) => state.setIsUpdatingAssignNum);

	const onIncrement = async () => {
		if (assignNum >= 255 || isUpdating) {
			return;
		}
		setIsUpdating(guid, true);
		try {
			await postRoleFilterUpdate({
				Op: PostExRAssignOps.FilterAssignNumIncrease,
				FilterId: guid,
				MapRoleId: null,
			});
			incrementAssignNum(guid);
		} catch (error) {
			console.error("Failed to increment AssignNum:", error);
		} finally {
			setIsUpdating(guid, false);
		}
	};

	const onDecrement = async () => {
		if (assignNum <= 1 || isUpdating) {
			return;
		}
		setIsUpdating(guid, true);
		try {
			await postRoleFilterUpdate({
				Op: PostExRAssignOps.FilterAssignNumDecrease,
				FilterId: guid,
				MapRoleId: null,
			});
			decrementAssignNum(guid);
		} catch (error) {
			console.error("Failed to decrement AssignNum:", error);
		} finally {
			setIsUpdating(guid, false);
		}
	};

	const onOpenRoleSelect = () => {
		openBlockDialog({
			type: "roleSelect",
			title: translationMetaData.RoleAssignFilterAddRole,
			searchQuery: "",
			excludeRoleIds: excludeRoleIds,
			selectedRoleIds: [],
			lastClickedId: null,
			onSelect: async (roleIds: number[]) => {
				try {
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
							translationMetaData.ROLE_FILTER_UNKNOWN_ROLE;

						addRoleToFilter(guid, roleId, roleName);
					}
				} catch (error) {
					console.error("Failed to add role to filter:", error);
				}
			},
		});
	};

	return (
		<>
			<div className="p-2 flex items-center">
				<span
					className={`${TYPOGRAPHY.LABEL} text-text-primary px-2 min-w-36 tabular-nums`}
				>
					{format(translationMetaData.ROLE_FILTER_ASSIGN_NUM_LABEL, assignNum)}
				</span>
				<ButtonGroup orientation="vertical">
					<Button
						onClick={onIncrement}
						disabled={assignNum >= 255 || isUpdating}
					>
						<ChevronUp />
					</Button>
					<Button onClick={onDecrement} disabled={assignNum <= 1 || isUpdating}>
						<ChevronDown />
					</Button>
				</ButtonGroup>
			</div>
			<Button
				onClick={onOpenRoleSelect}
				className={`${TYPOGRAPHY.LABEL} text-text-primary w-full col-span-full`}
			>
				<Plus size={12} />
				{translationMetaData.RoleAssignFilterAddRole}
			</Button>
		</>
	);
}
