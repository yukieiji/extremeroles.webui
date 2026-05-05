import { X } from "lucide-react";
import { useState } from "react";
import { RoleGrid } from "../../components/blocks/RoleGrid";
import { RoleSearchInput } from "../../components/parts/RoleSearchInput";
import { roleFilterMetaData } from "../../logics/api";
import { CLOSE, CONFIRM } from "../../noTrans";
import { useStore } from "../../useStore";

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
	const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
	const [lastClickedId, setLastClickedId] = useState<number | null>(null);

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

				setSelectedRoleIds((prev) => {
					const next = [...prev];
					for (const id of rangeIds) {
						if (!next.includes(id)) {
							next.push(id);
						}
					}
					return next;
				});
			}
		} else if (event.ctrlKey || event.metaKey) {
			// Toggle single selection
			setSelectedRoleIds((prev) =>
				prev.includes(roleId)
					? prev.filter((id) => id !== roleId)
					: [...prev, roleId],
			);
		} else {
			// Single selection (toggle for consistency with checkbox UI)
			setSelectedRoleIds((prev) =>
				prev.includes(roleId)
					? prev.filter((id) => id !== roleId)
					: [...prev, roleId],
			);
		}
		setLastClickedId(roleId);
	};

	return (
		<div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
			<div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
				<h3 className="text-xl font-bold text-gray-900">役職の選択</h3>
				<button
					type="button"
					onClick={onCancel}
					className="text-gray-400 hover:text-gray-600 transition-colors"
				>
					<X size={24} aria-label="Close icon" />
				</button>
			</div>
			<div className="px-6 py-3 border-b border-gray-50">
				<RoleSearchInput
					value={searchQuery}
					onChange={setSearchQuery}
					placeholder="役職を検索..."
				/>
			</div>
			<div className="px-6 py-4 overflow-y-auto">
				<RoleGrid
					items={filteredRoles}
					onSelect={handleSelect}
					selectedRoleIds={selectedRoleIds}
					excludeRoleIds={excludeRoleIds}
				/>
			</div>
			<div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
				>
					{CLOSE}
				</button>
				<button
					type="button"
					disabled={selectedRoleIds.length === 0}
					onClick={() => onSelect(selectedRoleIds)}
					className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{CONFIRM} ({selectedRoleIds.length})
				</button>
			</div>
		</div>
	);
}
