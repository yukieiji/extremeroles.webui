import { RoleFilterCard } from "../../components/blocks/RoleFilterCard";
import { useStore } from "../../useStore";

/**
 * Role Filter のデータをカード形式で表示するコンポーネント
 * featureディレクトリに配置され、ビジネスロジック（ストアからの取得）を含む
 */
export function RoleFilterViewer() {
	const roleFilterSet = useStore((state) => {
		return state.roleFilterSet;
	});

	if (!roleFilterSet) {
		return (
			<div className="p-4 bg-gray-100 rounded-md">
				<p className="text-gray-500">No role filter data available.</p>
			</div>
		);
	}

	return (
		<div className="p-4 flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{Object.entries(roleFilterSet).map(([guid, filterSet]) => {
					return (
						<RoleFilterCard key={guid} guid={guid} filterSet={filterSet} />
					);
				})}
			</div>
		</div>
	);
}
