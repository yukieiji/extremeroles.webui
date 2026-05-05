import type { ReactNode } from "react";
import { LoadingCycle } from "../parts/LoadingCycle";

interface CategoryContainerProp {
	isPending: boolean;
	children: ReactNode;
}

export function CategoryContainer({
	isPending,
	children,
}: CategoryContainerProp) {
	return (
		<div
			data-testid="category-list"
			className={`flex flex-col relative transition-opacity duration-200 flex-1 overflow-y-auto [scrollbar-gutter:stable] ${isPending ? "is-pending opacity-50 pointer-events-none" : "opacity-100"}`}
		>
			{isPending && (
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<LoadingCycle />
				</div>
			)}
			<div className="flex flex-col gap-2 shrink-0 min-h-0">{children}</div>
		</div>
	);
}
