interface RoleGridItem {
	roleId: number;
	roleName: string;
}

interface RoleGridProps {
	items: RoleGridItem[];
	onSelect: (roleId: number) => void;
	excludeRoleIds?: number[];
	emptyMessage?: string;
}

/**
 * 役職をグリッド形式で表示するリストコンポーネント
 */
export function RoleGrid({
	items,
	onSelect,
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
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
			{items.map(({ roleId, roleName }) => {
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
	);
}
