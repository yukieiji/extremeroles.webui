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
				borderTopWidth: "2px",
				borderLeftWidth: "2px",
				borderRightWidth: "2px",
				borderBottomWidth: "0px",
				borderStyle: "solid",
				borderColor: "transparent",
			};
		}
		return {
			borderColor: gradient,
			borderStyle: "solid",
			borderTopWidth: "2px",
			borderLeftWidth: "2px",
			borderRightWidth: "2px",
			borderBottomWidth: "0px",
		};
	})();

	return (
		// scroll分右は小さくする
		<div
			data-testid="category-list"
			className={`pl-2 pt-2 pr-1 flex flex-col relative transition-opacity duration-200 flex-1 [scrollbar-gutter:stable] min-h-0 ${hasColors ? "rounded-t-lg" : ""} ${isPending ? "is-pending opacity-50 pointer-events-none" : "opacity-100"}`}
			style={containerStyle}
		>
			{isPending && (
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<LoadingCycle />
				</div>
			)}
			{/* 下の要素を見やすく設定するために大きめの余白を入れてる、右はscroll分はいるので大きめに余白を入れる */}
			<div className="flex flex-col gap-2 overflow-y-scroll flex-1 pl-1 pr-2 pb-48 *:shrink-0">
				{children}
			</div>
		</div>
	);
}
