import type { ReactNode } from "react";
import { CLOSE, OPEN } from "@/noTrans";
import { AccordionSvg } from "../parts/AccordionSvg";
import { HighlightWrapper } from "../parts/HighlightWrapper";
import { LargePoint } from "../parts/LargePoint";
import { OptionRowContainer } from "../parts/OptionRowContainer";

interface HighlightableAccordionRowProps {
	id: string;
	isHighlight: boolean;
	children: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	hasActiveChildren?: boolean;
}

export function HighlightableAccordionRow({
	id,
	isHighlight,
	isOpen,
	onToggle,
	children,
	hasActiveChildren = true,
}: HighlightableAccordionRowProps) {
	return (
		<HighlightWrapper id={id} isHighlighted={isHighlight} isInset={true}>
			<OptionRowContainer
				leading={
					hasActiveChildren ? (
						<div className="flex items-center justify-center w-full h-full">
							<button
								type="button"
								onClick={onToggle}
								className="flex items-center justify-center text-gray-500 hover:text-gray-300 w-full h-full"
								aria-expanded={isOpen}
								aria-label={isOpen ? CLOSE : OPEN}
							>
								<AccordionSvg className={"w-4 h-4"} isOpen={isOpen} />
							</button>
						</div>
					) : (
						<LargePoint />
					)
				}
				content={children}
			/>
		</HighlightWrapper>
	);
}
