import type { ReactNode } from "react";

export interface AccordionContentContainerProps {
	isOpen: boolean;
	children: ReactNode;
}

export function AccordionContentContainer({
	isOpen,
	children,
}: AccordionContentContainerProps) {
	return (
		<div
			data-testid="accordion-content"
			className={`grid transition-[grid-template-rows] duration-200 ease-in-out overflow-hidden ${
				isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
			}`}
		>
			{children}
		</div>
	);
}
