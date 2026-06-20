import type { ReactNode } from "react";
import { getLinearGradient } from "@/logics/colorUtils";
import { LoadingCycle } from "../parts/LoadingCycle";

interface CategoryContainerProps {
	isPending: boolean;
	colors?: string[];
	children: ReactNode;
}

export function CategoryContainer({
	isPending,
	colors = [],
	children,
}: CategoryContainerProps) {
	const hasColors = colors.length > 0;

	const containerStyle = (() => {
		if (!hasColors) {
			return {};
		}

		const gradient = getLinearGradient(colors);
		if (gradient.startsWith("linear-gradient")) {
			return {
				backgroundImage: `linear-gradient(var(--n1-app-background), var(--n1-app-background)), ${gradient}`,
				backgroundOrigin: "border-box",
				backgroundClip: "padding-box, border-box",
				border: "2px solid transparent",
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
			className={`p-2 flex flex-col relative transition-opacity duration-200 flex-1 [scrollbar-gutter:stable] min-h-0 ${hasColors ? "rounded-lg" : ""} ${isPending ? "is-pending opacity-50 pointer-events-none" : "opacity-100"}`}
			style={containerStyle}
		>
			{isPending && (
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<LoadingCycle />
				</div>
			)}
			{/* 下の要素を見やすく設定するために大きめの余白を入れてる */}
			<div className="flex flex-col gap-2 overflow-y-scroll flex-1 px-1 pb-48 *:shrink-0">
				{children}
			</div>
		</div>
	);
}
