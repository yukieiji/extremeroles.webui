import { X } from "lucide-react";
import { RoleGrid } from "@/components/blocks/RoleGrid";
import { RoleSearchInput } from "@/components/parts/RoleSearchInput";
import { Button } from "@/components/ui/button";
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
		<div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col h-[min(80vh,600px)]">
			<div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
				<h3 className="text-xl font-bold text-gray-900">役職の選択</h3>
				<Button onClick={onCancel}>
					<X aria-label="Close icon" />
				</Button>
			</div>
			<div className="px-6 py-3 border-b border-gray-50">
				<RoleSearchInput
					value={searchQuery}
					onChange={setSearchQuery}
					placeholder="役職を検索..."
				/>
			</div>
			<div className="px-6 py-4 overflow-y-scroll flex-1">
				<RoleGrid
					items={filteredRoles}
					onSelect={handleSelect}
					selectedRoleIds={selectedRoleIds}
					excludeRoleIds={excludeRoleIds}
				/>
			</div>
			<div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
				<Button onClick={onCancel}>{CLOSE}</Button>
				<Button
					disabled={selectedRoleIds.length === 0}
					onClick={() => onSelect(selectedRoleIds)}
				>
					{CONFIRM} ({selectedRoleIds.length})
				</Button>
			</div>
		</div>
	);
}
