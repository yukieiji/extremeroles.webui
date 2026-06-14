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
		<div className="border-border-strong rounded-lg border-2 overflow-hidden bg-n4-components-background shadow-lg">
			<button
				type="button"
				onClick={onToggle}
				className="w-full flex items-center gap-2 p-2 hover:bg-component-hover transition-colors text-left"
				aria-expanded={isOpen}
			>
				<AccordionSvg className="w-4 h-4 text-text-tertiary" isOpen={isOpen} />
				<div
					className={`${TYPOGRAPHY.LABEL} font-semibold text-text-primary flex-1`}
				>
					{title}
				</div>
			</button>
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0">
					{isOpen && (
						<div className="py-2 px-1.5 border-border-weak">{children}</div>
					)}
				</div>
			</AccordionContentContainer>
		</div>
	);
}
