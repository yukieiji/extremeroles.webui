import { roleFilterMetaData } from "../../logics/api";
import { CLOSE } from "../../noTrans";
import { useStore } from "../../useStore";

interface RoleSelectDialogProps {
	onSelect: (roleId: number) => void;
	onCancel: () => void;
	excludeRoleIds?: number[];
}

/**
 * 役職を選択するためのダイアログコンテンツ
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
		<div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
			<div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
				<h3 className="text-xl font-bold text-gray-900">役職の選択</h3>
				<button
					type="button"
					onClick={onCancel}
					className="text-gray-400 hover:text-gray-600 transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						role="img"
						aria-label="Close icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<div className="px-6 py-3 border-b border-gray-50">
				<div className="relative">
					<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							role="img"
							aria-label="Search icon"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</span>
					<input
						type="text"
						className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						placeholder="役職を検索..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>
			<div className="px-6 py-4 overflow-y-auto">
				{filteredRoles.length === 0 ? (
					<div className="text-center py-8 text-gray-500 italic">
						見つかりませんでした
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
						{filteredRoles.map(({ roleId, roleName }) => {
							const isExcluded = excludeRoleIds.includes(roleId);

							return (
								<button
									key={roleId}
									type="button"
									disabled={isExcluded}
									onClick={() => onSelect(roleId)}
									className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
										isExcluded
											? "bg-gray-100 text-gray-400 cursor-not-allowed"
											: "bg-gray-50 hover:bg-indigo-50 text-gray-700 border border-gray-200 hover:border-indigo-200 shadow-sm"
									}`}
								>
									<div className="flex flex-col gap-0.5">
										<span className="truncate">{roleName}</span>
										{isExcluded && (
											<span className="text-[9px] text-gray-400 font-normal uppercase tracking-wider">
												追加済み
											</span>
										)}
									</div>
								</button>
							);
						})}
					</div>
				)}
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
