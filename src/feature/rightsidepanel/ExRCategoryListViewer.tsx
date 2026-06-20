import { ExRCategoryViewer } from "./ExRCategoryViewer";

interface ExRCategoryListViewerProps {
	categoryIds: number[];
}

export function ExRCategoryListViewer({
	categoryIds,
}: ExRCategoryListViewerProps) {
	return (
		<div className="flex flex-col gap-2">
			{categoryIds.map((categoryId) => (
				<ExRCategoryViewer key={categoryId} categoryId={categoryId} />
			))}
		</div>
	);
}
