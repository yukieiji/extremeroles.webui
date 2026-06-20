import type { ReactNode } from "react";
import { TYPOGRAPHY } from "@/designConstants";
import { AccordionContentContainer } from "../parts/AccordionContentContainer";
import { AccordionSvg } from "../parts/AccordionSvg";

interface ViewerGroupAccordionProps {
	title: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	children: ReactNode;
}

/**
 * 閲覧モード用のコンパクトなアコーディオンコンポーネント
 */
export function ViewerGroupAccordion({
	title,
	isOpen,
	onToggle,
	children,
}: ViewerGroupAccordionProps) {
	return (
		<div className="border-border-strong rounded-lg border overflow-hidden bg-n4-components-background shadow-md">
			<button
				type="button"
				onClick={onToggle}
				className="w-full flex items-center hover:bg-component-hover transition-colors text-left p-2"
				aria-expanded={isOpen}
			>
				<AccordionSvg className="w-4 h-4 text-text-tertiary" isOpen={isOpen} />
				<div className={`${TYPOGRAPHY.LABEL} text-text-primary flex-1`}>
					{title}
				</div>
			</button>
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0">
					{isOpen && (
						<div className="border-border-weak border-t p-2">{children}</div>
					)}
				</div>
			</AccordionContentContainer>
		</div>
	);
}
