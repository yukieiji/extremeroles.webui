import type { ReactNode } from "react";
import { CLOSE, OPEN } from "@/noTrans";
import { AccordionSvg } from "../parts/AccordionSvg";
import { HighlightWrapper } from "../parts/HighlightWrapper";
import { OptionRowContainer } from "../parts/OptionRowContainer";

interface HighlightableAccordionRowProps {
	id: string;
	isHighlight: boolean;
	children: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	depth?: number;
}

export function HighlightableAccordionRow({
	id,
	isHighlight,
	isOpen,
	onToggle,
	children,
	depth = 0,
}: HighlightableAccordionRowProps) {
	return (
		<HighlightWrapper id={id} isHighlighted={isHighlight} isInset={true}>
			<OptionRowContainer
				leading={
					<div className="flex items-center justify-center w-full h-full">
						<button
							type="button"
							onClick={onToggle}
							className="flex items-center justify-center text-text-primary w-full h-full"
							aria-expanded={isOpen}
							aria-label={isOpen ? CLOSE : OPEN}
						>
							<AccordionSvg className={"w-4 h-4"} isOpen={isOpen} />
						</button>
					</div>
				}
				content={children}
				depth={depth}
				indentMultiplier={1}
			/>
		</HighlightWrapper>
	);
}
