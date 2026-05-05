import { ExRCategoryViewer } from "./ExRCategoryViewer";

interface ExRCategoryListViewerProps {
	categoryIds: number[];
}

export function ExRCategoryListViewer({
	categoryIds,
}: ExRCategoryListViewerProps) {
	return (
		<div className="flex flex-col gap-1.5">
			{categoryIds.map((categoryId) => (
				<ExRCategoryViewer key={categoryId} categoryId={categoryId} />
			))}
		</div>
	);
}
