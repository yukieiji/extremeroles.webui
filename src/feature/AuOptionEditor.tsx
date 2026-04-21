import { auOptionMetaData } from "../logics/api";
import { useStore } from "../useStore";
import { AuTabSelector } from "./AuTabSelector";

/**
 * Auオプションを表示するコンポーネント
 */
export function AuOptionEditor() {
	const selectedAuTabId = useStore((state) => {
		return state.selectedAuTabId;
	});
	const isAuTabPending = useStore((state) => {
		return state.isAuTabPending;
	});

	const categoryIds = auOptionMetaData.tabCategoryMap[selectedAuTabId] || [];
	const filteredData = categoryIds.map((id) => {
		const categoryMeta = auOptionMetaData.categoryMetaData[id];
		return {
			categoryName: categoryMeta.name,
			options: categoryMeta.options.map((optId) => {
				const optMeta = auOptionMetaData.options[optId];
				return {
					id: optId,
					title: optMeta.title,
					format: optMeta.format,
					range: optMeta.range,
				};
			}),
		};
	});

	return (
		<div className="flex flex-col gap-4">
			<AuTabSelector />
			<div
				className={`bg-gray-800 text-green-400 p-6 rounded-lg shadow-lg overflow-auto max-h-[80vh] relative transition-opacity duration-200 ${isAuTabPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}
			>
				{isAuTabPending && (
					<div className="absolute inset-0 flex items-center justify-center z-10">
						<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
					</div>
				)}
				<pre
					data-testid="au-json-pre"
					className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed"
				>
					{JSON.stringify(filteredData, null, 2)}
				</pre>
			</div>
		</div>
	);
}
