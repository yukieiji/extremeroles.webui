import type { ReactNode } from "react";
import { AccordionContentContainer } from "../parts/AccordionContentContainer";
import { AccordionSvg } from "../parts/AccordionSvg";

export interface CompactAccordionProps {
	title: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	children: ReactNode;
}

/**
 * 閲覧モード用のコンパクトなアコーディオンコンポーネント
 */
export function CompactAccordion({
	title,
	isOpen,
	onToggle,
	children,
}: CompactAccordionProps) {
	return (
		<div className="border border-gray-700 rounded-lg overflow-hidden mb-1">
			<button
				type="button"
				onClick={onToggle}
				className="w-full flex items-center gap-2 p-2 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
				aria-expanded={isOpen}
			>
				<AccordionSvg className="w-4 h-4 text-gray-400" isOpen={isOpen} />
				<div className="font-semibold text-gray-200 flex-1">{title}</div>
			</button>
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0">
					{isOpen && (
						<div className="p-2 bg-gray-900 border-t border-gray-700">
							{children}
						</div>
					)}
				</div>
			</AccordionContentContainer>
		</div>
	);
}
