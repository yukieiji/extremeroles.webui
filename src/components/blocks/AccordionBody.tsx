import type { ReactNode } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

export interface AccordionBodyProps {
	title: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	children: ReactNode;
}

/**
 * ステートレスなアコーディオンコンポーネント
 */
export function AccordionBody({
	title,
	isOpen,
	onToggle,
	children,
}: AccordionBodyProps) {
	return (
		<Accordion
			value={isOpen ? ["item-1"] : []}
			onValueChange={(value) => {
				if (value.includes("item-1") && !isOpen) {
					onToggle();
				} else if (!value.includes("item-1") && isOpen) {
					onToggle();
				}
			}}
		>
			<AccordionItem value="item-1">
				<AccordionTrigger className="w-full flex items-center gap-3 p-4 hover:bg-gray-700 transition-colors text-left cursor-pointer hover:no-underline [&>div>svg]:text-gray-400 [&>div>svg]:size-5">
					<span className="font-semibold text-gray-200">{title}</span>
				</AccordionTrigger>
				<AccordionContent className="p-0 pb-0">
					<div className="border-t border-gray-700">{children}</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
