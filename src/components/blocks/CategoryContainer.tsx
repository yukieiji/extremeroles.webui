import type { ReactNode } from "react";
import { LoadingCycle } from "../parts/LoadingCycle";

interface CategoryContainerProps {
	isPending: boolean;
	children: ReactNode;
}

export function CategoryContainer({
	isPending,
	children,
}: CategoryContainerProps) {
	return (
		<div
			data-testid="category-list"
			className={`flex flex-col relative transition-opacity duration-200 flex-1 overflow-y-auto [scrollbar-gutter:stable] gap-2 *:shrink-0 ${isPending ? "is-pending opacity-50 pointer-events-none" : "opacity-100"}`}
		>
			{isPending && (
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<LoadingCycle />
				</div>
			)}
			{children}
		</div>
	);
}
