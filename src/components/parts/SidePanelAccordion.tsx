import type { ReactNode } from "react";
import { BaseAccordion } from "./BaseAccordion";

interface SidePanelAccordionProps {
	title: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	children: ReactNode;
	className?: string;
}

/**
 * 右サイドパネル用のコンパクトなアコーディオンコンポーネント
 */
export function SidePanelAccordion({
	className = "",
	...props
}: SidePanelAccordionProps) {
	return (
		<BaseAccordion
			{...props}
			containerClassName={className}
			headerClassName="gap-2 p-2 bg-gray-800 hover:bg-gray-700"
			iconClassName="w-4 h-4"
			titleClassName="font-semibold text-gray-200 text-sm"
			contentClassName="p-2"
		/>
	);
}
