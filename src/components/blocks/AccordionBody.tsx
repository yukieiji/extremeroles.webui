import type { ReactNode } from "react";
import { TYPOGRAPHY } from "@/designConstants";
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
		<div className="bg-n4-components-background">
			<button
				type="button"
				onClick={onToggle}
				className="p-2 w-full flex items-center hover:bg-component-hover transition-colors text-left cursor-pointer"
				aria-expanded={isOpen}
			>
				<AccordionSvg
					className={"w-5 h-5 text-text-primary "}
					isOpen={isOpen}
				/>
				<span
					className={`${TYPOGRAPHY.LABEL} font-semibold text-text-primary p-1`}
				>
					{title}
				</span>
			</button>
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0">
					{isOpen && (
						<div className="border-t border-border-weak">{children}</div>
					)}
				</div>
			</AccordionContentContainer>
		</div>
	);
}
