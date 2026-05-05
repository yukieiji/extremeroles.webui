import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { postRoleFilterUpdate, roleFilterMetaData } from "../../logics/api";
import { PostExRAssignOps } from "../../type";
import { useStore } from "../../useStore";
import { Button } from "@/components/ui/button";

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
			title: "役職の追加",
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
							"Unknown Role";

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
			<div className="flex items-center gap-2">
				<span className="text-sm font-semibold text-gray-700">
					AssignNum: {assignNum}
				</span>
				<div className="flex flex-col gap-0.5">
					<Button
						variant="ghost"
						size="icon"
						onClick={onIncrement}
						disabled={assignNum >= 255 || isUpdating}
						className="h-5 w-5 p-0"
						aria-label="Increment AssignNum"
					>
						<ChevronUp size={14} />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={onDecrement}
						disabled={assignNum <= 1 || isUpdating}
						className="h-5 w-5 p-0"
						aria-label="Decrement AssignNum"
					>
						<ChevronDown size={14} />
					</Button>
				</div>
			</div>
			<Button
				variant="secondary"
				size="sm"
				onClick={onOpenRoleSelect}
				className="mt-1 self-start h-7 text-xs px-2"
			>
				<Plus size={12} className="mr-1" aria-hidden="true" />
				役職を追加
			</Button>
		</>
	);
}
