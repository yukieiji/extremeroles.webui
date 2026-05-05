import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { postRoleFilterUpdate, roleFilterMetaData } from "../../logics/api";
import { PostExRAssignOps } from "../../type";
import { useStore } from "../../useStore";

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

	const onIncrement = async () => {
		if (assignNum >= 255) return;
		try {
			await postRoleFilterUpdate({
				Op: PostExRAssignOps.FilterAssignNumIncrese,
				FilterId: guid,
				MapRoleId: null,
			});
			incrementAssignNum(guid);
		} catch (error) {
			console.error("Failed to increment AssignNum:", error);
		}
	};

	const onDecrement = async () => {
		if (assignNum <= 1) return;
		try {
			await postRoleFilterUpdate({
				Op: PostExRAssignOps.FilterAssignNumDecrese,
				FilterId: guid,
				MapRoleId: null,
			});
			decrementAssignNum(guid);
		} catch (error) {
			console.error("Failed to decrement AssignNum:", error);
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
				<div className="flex flex-col">
					<button
						type="button"
						onClick={onIncrement}
						disabled={assignNum >= 255}
						className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
						aria-label="Increment AssignNum"
					>
						<ChevronUp size={14} />
					</button>
					<button
						type="button"
						onClick={onDecrement}
						disabled={assignNum <= 1}
						className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
						aria-label="Decrement AssignNum"
					>
						<ChevronDown size={14} />
					</button>
				</div>
			</div>
			<button
				type="button"
				onClick={onOpenRoleSelect}
				className="mt-1 self-start inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
			>
				<Plus size={12} className="mr-1" aria-hidden="true" />
				役職を追加
			</button>
		</>
	);
}
