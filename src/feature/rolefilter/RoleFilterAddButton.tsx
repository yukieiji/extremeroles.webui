import { postRoleFilterUpdate } from "../../logics/api";
import { PostExRAssignOps } from "../../type";
import { useStore } from "../../useStore";

/**
 * フィルターを追加するためのボタンコンポーネント (ビジネスロジックを含む)
 */
export function RoleFilterAddButton() {
	const addRoleFilter = useStore((state) => state.addRoleFilter);

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

	return (
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
	);
}
