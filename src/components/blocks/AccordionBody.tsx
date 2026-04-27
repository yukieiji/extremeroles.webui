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
				className="w-full flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
				aria-expanded={isOpen}
			>
				<AccordionSvg className={"w-5 h-5 text-gray-400 "} isOpen={isOpen} />
				<span className="font-semibold text-gray-200">{title}</span>
			</button>
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0">
					{isOpen && (
						<div className="p-4 bg-gray-900 border-t border-gray-700">
							{children}
						</div>
					)}
				</div>
			</AccordionContentContainer>
		</>
	);
}
