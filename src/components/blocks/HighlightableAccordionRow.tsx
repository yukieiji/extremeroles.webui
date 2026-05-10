import type { ReactNode } from "react";
import { CLOSE, OPEN } from "@/noTrans";
import { AccordionTrigger } from "../ui/accordion";
import { HighlightWrapper } from "../parts/HighlightWrapper";
import { OptionRowContainer } from "../parts/OptionRowContainer";

interface HighlightableAccordionRowProps {
	id: string;
	isHighlight: boolean;
	children: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
}

export function HighlightableAccordionRow({
	id,
	isHighlight,
	isOpen,
	children,
}: HighlightableAccordionRowProps) {
	return (
		<HighlightWrapper id={id} isHighlighted={isHighlight} isInset={true}>
			<OptionRowContainer
				leading={
					<div className="flex items-center justify-center w-full h-full">
						<AccordionTrigger
							className="flex items-center justify-center text-gray-500 hover:text-gray-300 w-full h-full p-0 gap-0 justify-items-center hover:no-underline [&>div>svg]:size-4"
							aria-label={isOpen ? CLOSE : OPEN}
						/>
					</div>
				}
				content={children}
			/>
		</HighlightWrapper>
	);
}
