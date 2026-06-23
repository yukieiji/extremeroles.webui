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
import { normalizeForSearch } from "@/logics/stringUtils";
import { CLOSE, CONFIRM, ROLE_SELECT_SEARCH_PLACEHOLDER } from "@/noTrans";
import { useStore } from "@/useStore";

interface RoleSelectDialogProps {
	title: string;
	onSelect: (roleIds: number[]) => void;
	onCancel: () => void;
	excludeRoleIds?: number[];
}

/**
 * 役職を選択するためのダイアログコンテンツ (ビジネスロジックを含む feature コンポーネント)
 */
export function RoleSelectDialog({
	title,
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
	const updateSelectedRoleIds = useStore(
		(state) => state.updateSelectedRoleIds,
	);

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

	const excludeSet = new Set(excludeRoleIds);
	const normalizedQuery = normalizeForSearch(searchQuery);
	const filteredRoles = allRoles.filter(
		({ roleId, roleName }) =>
			!excludeSet.has(roleId) &&
			normalizeForSearch(roleName).includes(normalizedQuery),
	);

	const handleSelect = (roleId: number, isShift: boolean) => {
		if (isShift && lastClickedId !== null) {
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

				updateSelectedRoleIds(...rangeIds);
			}
		} else {
			updateSelectedRoleIds(roleId);
		}
		setLastClickedId(roleId);
	};

	return (
		<DialogContent className="flex flex-col max-w-5xl h-[min(80vh,600px)]">
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
			</DialogHeader>
			<RoleSearchInput
				onChange={setSearchQuery}
				placeholder={ROLE_SELECT_SEARCH_PLACEHOLDER}
			/>
			<div className="overflow-y-scroll flex-1">
				<RoleGrid
					items={filteredRoles}
					selectedRoleIds={selectedRoleIds}
					onSelect={handleSelect}
				/>
			</div>
			<DialogFooter>
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
