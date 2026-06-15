import type { AccordionBodyProps } from "./AccordionBody";
import { AccordionBody } from "./AccordionBody";

export function OptionEditorAccordion({
	title,
	isOpen,
	onToggle,
	children,
}: AccordionBodyProps) {
	return (
		<div className="border border-border-strong rounded-lg overflow-hidden shadow-md">
			<AccordionBody title={title} isOpen={isOpen} onToggle={onToggle}>
				{children}
			</AccordionBody>
		</div>
	);
}
