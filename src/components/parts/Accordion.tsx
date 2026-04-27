import type { ReactNode } from "react";
import { BaseAccordion } from "./BaseAccordion";

interface AccordionProps {
	title: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	children: ReactNode;
}

/**
 * 標準的なアコーディオンコンポーネント
 */
export function Accordion(props: AccordionProps) {
	return (
		<BaseAccordion
			{...props}
			containerClassName="mb-2"
			headerClassName="gap-3 p-4 bg-gray-800 hover:bg-gray-700"
			iconClassName="w-5 h-5"
			titleClassName="font-semibold text-gray-200"
			contentClassName="p-4"
		/>
	);
}
