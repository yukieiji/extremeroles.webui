import { Check } from "lucide-react";

interface RoleGridItem {
	roleId: number;
	roleName: string;
}

interface RoleGridProps {
	items: RoleGridItem[];
	onSelect: (roleId: number, event: React.MouseEvent) => void;
	selectedRoleIds?: number[];
	excludeRoleIds?: number[];
	emptyMessage?: string;
}

/**
 * 役職をグリッド形式で表示するリストコンポーネント
 */
export function RoleGrid({
	items,
	onSelect,
	selectedRoleIds = [],
	excludeRoleIds = [],
	emptyMessage = "見つかりませんでした",
}: RoleGridProps) {
	if (items.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500 italic">
				{emptyMessage}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
			{items.map(({ roleId, roleName }) => {
				const isExcluded = excludeRoleIds.includes(roleId);
				const isSelected = selectedRoleIds.includes(roleId);

				return (
					<button
						key={roleId}
						type="button"
						disabled={isExcluded}
						onClick={(e) => onSelect(roleId, e)}
						className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all border flex items-center gap-3 ${
							isExcluded
								? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
								: isSelected
									? "bg-indigo-100 text-indigo-700 border-indigo-300 shadow-sm ring-1 ring-indigo-300"
									: "bg-gray-50 hover:bg-indigo-50 text-gray-700 border-gray-200 hover:border-indigo-200 shadow-sm"
						}`}
					>
						<div
							className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
								isExcluded
									? "bg-gray-200 border-gray-300"
									: isSelected
										? "bg-indigo-600 border-indigo-600"
										: "bg-white border-gray-300"
							}`}
						>
							{isSelected && (
								<Check
									className="w-3 h-3 text-white"
									strokeWidth={4}
									aria-label="Selected"
								/>
							)}
						</div>
						<div className="flex flex-col gap-0.5 overflow-hidden">
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
	);
}
