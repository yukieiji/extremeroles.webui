import type { ReactNode } from "react";
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
		<div className="border-n2-border-strong rounded-lg border overflow-hidden">
			<button
				type="button"
				onClick={onToggle}
				className="w-full flex items-center gap-2 p-2 hover:bg-hover-on-n4 transition-colors text-left"
				aria-expanded={isOpen}
			>
				<AccordionSvg className="w-4 h-4 text-text-tertiary" isOpen={isOpen} />
				<div className="font-semibold text-text-primary flex-1 text-lg">
					{title}
				</div>
			</button>
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0">
					{isOpen && (
						<div className="py-2 px-1.5 border-t border-n3-border-weak">
							{children}
						</div>
					)}
				</div>
			</AccordionContentContainer>
		</div>
	);
}
