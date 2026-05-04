import { X } from "lucide-react";
import { RoleGrid } from "../../components/blocks/RoleGrid";
import { RoleSearchInput } from "../../components/parts/RoleSearchInput";
import { roleFilterMetaData } from "../../logics/api";
import { CLOSE } from "../../noTrans";
import { useStore } from "../../useStore";

interface RoleSelectDialogProps {
	onSelect: (roleId: number) => void;
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
	const searchQuery = useStore((state) => {
		if (state.blockDialog?.type === "roleSelect") {
			return state.blockDialog.searchQuery;
		}
		return "";
	});
	const setSearchQuery = useStore((state) => state.setRoleSearchQuery);

	const filteredRoles = roleFilterMetaData.FilterRoleId.map((roleId) => {
		const roleName =
			(roleFilterMetaData.NormalRoleId[roleId] as string) ||
			(roleFilterMetaData.CombinationId[roleId] as string) ||
			(roleFilterMetaData.GhostRoleId[roleId] as string) ||
			`Role ${roleId}`;
		return { roleId, roleName };
	}).filter(({ roleName }) =>
		roleName.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col h-[80vh]">
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
			<div className="px-6 py-4 overflow-y-auto flex-1">
				<RoleGrid
					items={filteredRoles}
					onSelect={onSelect}
					excludeRoleIds={excludeRoleIds}
				/>
			</div>
			<div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
				>
					{CLOSE}
				</button>
			</div>
		</div>
	);
}
