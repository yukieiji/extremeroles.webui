import type { AccordionBodyProps } from "./AccordionBody";
import { AccordionBody } from "./AccordionBody";

export function OptionEditorAccordion({
	title,
	isOpen,
	onToggle,
	children,
}: AccordionBodyProps) {
	return (
		<div className="border border-gray-700 rounded-lg overflow-hidden mb-2">
			<AccordionBody title={title} isOpen={isOpen} onToggle={onToggle}>
				{children}
			</AccordionBody>
		</div>
	);
}
