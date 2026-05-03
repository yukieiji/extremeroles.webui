import { ExRCategoryViewer } from "./ExRCategoryViewer";

interface ExRCategoryListViewerProp {
	categoryIds: number[];
}

export function ExRCategoryListViewer({
	categoryIds,
}: ExRCategoryListViewerProp) {
	return (
		<div className="flex flex-col gap-1.5">
			{categoryIds.map((categoryId) => (
				<ExRCategoryViewer key={categoryId} categoryId={categoryId} />
			))}
		</div>
	);
}
