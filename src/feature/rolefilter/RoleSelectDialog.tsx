import { RoleGrid } from "@/components/blocks/RoleGrid";
import { RoleSearchInput } from "@/components/parts/RoleSearchInput";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { roleFilterMetaData } from "@/logics/api";
import { CLOSE, CONFIRM } from "@/noTrans";
import { useStore } from "@/useStore";

interface RoleSelectDialogProps {
	onSelect: (roleIds: number[]) => void;
	onCancel: () => void;
	excludeRoleIds?: number[];
}

/**
 * 役職を選択するためのダイアログコンテンツ (ビジネスロジックを含む feature コンポーネント)
 */
export function RoleSelectDialog({
	onSelect,
	onCancel,
	excludeRoleIds = [],
}: RoleSelectDialogProps) {
	const selectedRoleIds = useStore((state) => {
		if (state.blockDialog?.type === "roleSelect") {
			return state.blockDialog.selectedRoleIds;
		}
		return [];
	});
	const setSelectedRoleIds = useStore((state) => state.setSelectedRoleIds);

	const lastClickedId = useStore((state) => {
		if (state.blockDialog?.type === "roleSelect") {
			return state.blockDialog.lastClickedId;
		}
		return null;
	});
	const setLastClickedId = useStore((state) => state.setLastClickedId);

	const searchQuery = useStore((state) => {
		if (state.blockDialog?.type === "roleSelect") {
			return state.blockDialog.searchQuery;
		}
		return "";
	});
	const setSearchQuery = useStore((state) => state.setRoleSearchQuery);

	const allRoles = roleFilterMetaData.FilterRoleId.map((roleId) => {
		const roleName =
			(roleFilterMetaData.NormalRoleId[roleId] as string) ||
			(roleFilterMetaData.CombinationId[roleId] as string) ||
			(roleFilterMetaData.GhostRoleId[roleId] as string) ||
			`Role ${roleId}`;
		return { roleId, roleName };
	});

	const filteredRoles = allRoles.filter(({ roleName }) =>
		roleName.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleSelect = (roleId: number, event: React.MouseEvent) => {
		if (event.shiftKey && lastClickedId !== null) {
			// Range selection
			const lastIndex = filteredRoles.findIndex(
				(r) => r.roleId === lastClickedId,
			);
			const currentIndex = filteredRoles.findIndex((r) => r.roleId === roleId);

			if (lastIndex !== -1 && currentIndex !== -1) {
				const start = Math.min(lastIndex, currentIndex);
				const end = Math.max(lastIndex, currentIndex);
				const rangeIds = filteredRoles
					.slice(start, end + 1)
					.filter((r) => !excludeRoleIds.includes(r.roleId))
					.map((r) => r.roleId);

				const nextSet = new Set([...selectedRoleIds, ...rangeIds]);
				setSelectedRoleIds(Array.from(nextSet));
			}
		} else {
			setSelectedRoleIds(
				selectedRoleIds.includes(roleId)
					? selectedRoleIds.filter((id) => id !== roleId)
					: [...selectedRoleIds, roleId],
			);
		}
		setLastClickedId(roleId);
	};

	return (
		<DialogContent className="max-w-5xl h-[min(80vh,600px)] flex flex-col p-0 overflow-hidden">
			<DialogHeader className="px-6 py-4 border-b">
				<DialogTitle>役職の選択</DialogTitle>
			</DialogHeader>
			<div className="px-6 py-3 border-b">
				<RoleSearchInput
					value={searchQuery}
					onChange={setSearchQuery}
					placeholder="役職を検索..."
				/>
			</div>
			<div className="px-6 py-4 overflow-y-auto flex-1">
				<RoleGrid
					items={filteredRoles}
					onSelect={handleSelect}
					selectedRoleIds={selectedRoleIds}
					excludeRoleIds={excludeRoleIds}
				/>
			</div>
			<DialogFooter className="px-6 py-4 border-t bg-muted/50 m-0 rounded-none">
				<Button variant="outline" onClick={onCancel}>
					{CLOSE}
				</Button>
				<Button
					disabled={selectedRoleIds.length === 0}
					onClick={() => onSelect(selectedRoleIds)}
				>
					{CONFIRM} ({selectedRoleIds.length})
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}
