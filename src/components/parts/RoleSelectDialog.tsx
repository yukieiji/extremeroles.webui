import { roleFilterMetaData } from "../../logics/api";
import { CLOSE } from "../../noTrans";

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
	return (
		<div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
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
			<div className="px-6 py-4 overflow-y-auto">
				<div className="grid grid-cols-1 gap-2">
					{roleFilterMetaData.FilterRoleId.map((roleId: number) => {
						const roleName =
							(roleFilterMetaData.NormalRoleId[roleId] as string) ||
							(roleFilterMetaData.CombinationId[roleId] as string) ||
							(roleFilterMetaData.GhostRoleId[roleId] as string) ||
							`Role ${roleId}`;
						const isExcluded = excludeRoleIds.includes(roleId);

						return (
							<button
								key={roleId}
								type="button"
								disabled={isExcluded}
								onClick={() => onSelect(roleId)}
								className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
									isExcluded
										? "bg-gray-100 text-gray-400 cursor-not-allowed"
										: "bg-gray-50 hover:bg-indigo-50 text-gray-700 border border-gray-200 hover:border-indigo-200"
								}`}
							>
								<div className="flex justify-between items-center">
									<span>{roleName}</span>
									{isExcluded && (
										<span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
											追加済み
										</span>
									)}
								</div>
							</button>
						);
					})}
				</div>
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
