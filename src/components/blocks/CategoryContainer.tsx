import type { ReactNode } from "react";
import { getLinearGradient } from "@/logics/colorUtils";
import { LoadingCycle } from "../parts/LoadingCycle";

interface CategoryContainerProps {
	isPending: boolean;
	colors?: string[];
	isGhost?: boolean;
	children: ReactNode;
}

export function CategoryContainer({
	isPending,
	colors = [],
	isGhost = false,
	children,
}: CategoryContainerProps) {
	const borderStyle = (() => {
		const gradient = getLinearGradient(colors, isGhost);
		if (gradient.startsWith("linear-gradient")) {
			return {
				borderImageSource: gradient,
				borderImageSlice: 1,
				borderStyle: "solid",
				borderWidth: "2px",
			};
		}
		return {
			borderColor: gradient,
			borderStyle: "solid",
			borderWidth: "2px",
		};
	})();

	return (
		<div
			data-testid="category-list"
			className={`pb-20 flex flex-col relative transition-opacity duration-200 flex-1 overflow-y-auto [scrollbar-gutter:stable] gap-2 *:shrink-0 rounded-lg ${isPending ? "is-pending opacity-50 pointer-events-none" : "opacity-100"}`}
			style={borderStyle}
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
