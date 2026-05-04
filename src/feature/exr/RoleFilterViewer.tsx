import { RoleFilterCard } from "../../components/blocks/RoleFilterCard";
import { postRoleFilterUpdate } from "../../logics/api";
import { PostExRAssignOps } from "../../type";
import { useStore } from "../../useStore";

/**
 * Role Filter のデータをカード形式で表示するコンポーネント
 * featureディレクトリに配置され、ビジネスロジック（ストアからの取得）を含む
 */
export function RoleFilterViewer() {
	const roleFilterSet = useStore((state) => {
		return state.roleFilterSet;
	});
	const addRoleFilter = useStore((state) => {
		return state.addRoleFilter;
	});

	const onAddFilter = async () => {
		const guid = crypto.randomUUID();
		try {
			await postRoleFilterUpdate({
				Op: PostExRAssignOps.FilterNewAdd,
				FilterId: guid,
				MapRoleId: null,
			});
			addRoleFilter(guid);
		} catch (error) {
			console.error("Failed to add role filter:", error);
		}
	};

	const filterEntries = Object.entries(roleFilterSet);

	return (
		<div className="p-4 flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-auto">
			<div className="flex justify-between items-center">
				<h2 className="text-lg font-bold text-gray-800">Filter List</h2>
				<button
					type="button"
					onClick={onAddFilter}
					className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						role="img"
						aria-label="Add filter icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
					フィルターを追加
				</button>
			</div>

			{filterEntries.length === 0 ? (
				<div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg text-center">
					<p className="text-gray-500">
						フィルターがありません。「フィルターを追加」ボタンから作成してください。
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
