import type { ReactNode } from "react";

export interface AccordionContentContainerProps {
	isOpen: boolean;
	children: ReactNode;
	"data-testid"?: string;
}

export function AccordionContentContainer({
	isOpen,
	children,
	"data-testid": testId = "accordion-content",
}: AccordionContentContainerProps) {
	return (
		<div
			data-testid={testId}
			className={`grid transition-[grid-template-rows] duration-200 ease-in-out overflow-hidden ${
				isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
			}`}
		>
			{children}
		</div>
	);
}
