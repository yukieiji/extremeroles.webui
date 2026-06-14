import type { ReactNode } from "react";
import { AccordionContentContainer } from "../parts/AccordionContentContainer";
import { AccordionSvg } from "../parts/AccordionSvg";

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
		<>
			<button
				type="button"
				onClick={onToggle}
				className="w-full flex items-center gap-3 p-4 bg-n4-components-background hover:bg-gray-100 transition-colors text-left cursor-pointer"
				aria-expanded={isOpen}
			>
				<AccordionSvg
					className={"w-5 h-5 text-text-primary "}
					isOpen={isOpen}
				/>
				<span className="font-semibold text-text-primary">{title}</span>
			</button>
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0">
					{isOpen && <div className="border-t border-border-weak">{children}</div>}
				</div>
			</AccordionContentContainer>
		</>
	);
}
