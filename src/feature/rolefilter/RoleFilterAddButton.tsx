import { Plus } from "lucide-react";
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
<Plus size={20} className="mr-1" aria-hidden="true" />
			フィルターを追加
		</button>
	);
}
