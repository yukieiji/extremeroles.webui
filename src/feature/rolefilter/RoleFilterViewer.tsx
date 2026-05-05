import { useStore } from "../../useStore";
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
		<div className="p-4 flex flex-col gap-4 max-h-dvh overflow-auto">
			<div className="flex justify-between items-center">
				<RoleFilterAddButton />
			</div>

			{filterEntries.length === 0 ? (
				<div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg text-center">
					<p className="text-gray-500">
						フィルターがありません。「フィルターを追加」ボタンから作成してください。
					</p>
				</div>
			) : (
				<ul
					aria-label="Filter List"
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
				>
					{filterEntries.map(([guid, filterSet]) => {
						return (
							<RoleFilterCard key={guid} guid={guid} filterSet={filterSet} />
						);
					})}
				</ul>
			)}
		</div>
	);
}
