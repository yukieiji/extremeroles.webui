import { TYPOGRAPHY } from "@/designConstants";
import { ROLE_FILTER_EMPTY_MESSAGE } from "@/noTrans";
import { useStore } from "@/useStore";
import { RoleFilterAddButton } from "./RoleFilterAddButton";
import { RoleFilterCard } from "./RoleFilterCard";

/**
 * Role Filter のデータをカード形式で表示するコンポーネント
 * featureディレクトリに配置され、ビジネスロジック（ストアからの取得）を含む
 */
export function RoleFilterViewer() {
	const roleFilterSet = useStore((state) => {
		return state.roleFilterSet;
	});

	const filterEntries = Object.entries(roleFilterSet);

	return (
		<div className="flex flex-col flex-1 overflow-y-auto [scrollbar-gutter:stable] *:shrink-0">
			<div className="py-4 px-2 flex justify-between items-center">
				<RoleFilterAddButton />
			</div>

			{filterEntries.length === 0 ? (
				<div className="bg-n4-components-background border border-dashed border-border-strong rounded-lg text-center shadow-md">
					<p className={`${TYPOGRAPHY.LABEL} text-text-secondary`}>
						{ROLE_FILTER_EMPTY_MESSAGE}
					</p>
				</div>
			) : (
				<div
					data-testid="role-filter-list"
					className="p-2 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
				>
					{filterEntries.map(([guid, filterSet]) => {
						return (
							<RoleFilterCard key={guid} guid={guid} filterSet={filterSet} />
						);
					})}
				</div>
			)}
		</div>
	);
}
