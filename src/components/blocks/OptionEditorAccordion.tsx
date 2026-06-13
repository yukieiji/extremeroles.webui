import type { AccordionBodyProps } from "./AccordionBody";
import { AccordionBody } from "./AccordionBody";

export function OptionEditorAccordion({
	title,
	isOpen,
	onToggle,
	children,
}: AccordionBodyProps) {
	return (
		<div className="border border-n2-border-strong rounded-lg overflow-hidden">
			<AccordionBody title={title} isOpen={isOpen} onToggle={onToggle}>
				{children}
			</AccordionBody>
		</div>
	);
}
