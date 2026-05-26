import type { ReactNode } from "react";
import { LoadingCycle } from "../parts/LoadingCycle";

interface CategoryContainerProps {
	isPending: boolean;
	borderColor?: string;
	isGradient?: boolean;
	children: ReactNode;
}

export function CategoryContainer({
	isPending,
	borderColor,
	isGradient,
	children,
}: CategoryContainerProps) {
	const borderStyle = isGradient
		? {
				backgroundImage:
					"linear-gradient(var(--background), var(--background)), " +
					borderColor,
				backgroundOrigin: "border-box",
				backgroundClip: "padding-box, border-box",
				border: "2px solid transparent",
			}
		: {
				borderColor: borderColor || "var(--border)",
				borderWidth: "2px",
				borderStyle: "solid",
			};

	return (
		<div
			data-testid="category-list"
			className={`pb-20 flex flex-col relative transition-opacity duration-200 flex-1 overflow-y-auto [scrollbar-gutter:stable] gap-2 *:shrink-0 rounded-xl ${isPending ? "is-pending opacity-50 pointer-events-none" : "opacity-100"}`}
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
