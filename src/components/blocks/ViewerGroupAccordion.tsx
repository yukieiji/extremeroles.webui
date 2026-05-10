import type { ReactNode } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

interface ViewerGroupAccordionProps {
	title: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	children: ReactNode;
}

/**
 * 閲覧モード用のコンパクトなアコーディオンコンポーネント
 */
export function ViewerGroupAccordion({
	title,
	isOpen,
	onToggle,
	children,
}: ViewerGroupAccordionProps) {
	return (
		<div className="border-gray-700 rounded-lg border overflow-hidden">
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
					<AccordionTrigger className="w-full flex items-center gap-2 p-2 bg-gray-800 hover:bg-gray-700 transition-colors text-left hover:no-underline [&>div>svg]:text-gray-400 [&>div>svg]:size-4">
						<div className="font-semibold text-gray-200 flex-1 text-lg">
							{title}
						</div>
					</AccordionTrigger>
					<AccordionContent className="p-0 pb-0">
						<div className="py-2 px-1.5 bg-gray-900 border-gray-700 border-t">
							{children}
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
