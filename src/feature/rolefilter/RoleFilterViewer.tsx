import { TYPOGRAPHY } from "@/designConstants";
import { translationMetaData } from "@/logics/api";
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
		<div className="@container flex flex-col h-full">
			<div className="p-2">
				<RoleFilterAddButton />
			</div>
			{filterEntries.length !== 0 && (
				<div
					data-testid="role-filter-list"
					className="p-2 gap-4 grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 overflow-y-scroll"
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
