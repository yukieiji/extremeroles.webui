import type { ReactNode } from "react";
import { AccordionSvg } from "../parts/AccordionSvg";

interface OptionEditorAccordionProps {
	title: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	children: ReactNode;
}

/**
 * ステートレスなアコーディオンコンポーネント
 */
export function OptionEditorAccordion({
	title,
	isOpen,
	onToggle,
	children,
}: OptionEditorAccordionProps) {
	return (
		<div className="border border-gray-700 rounded-lg overflow-hidden mb-2">
			<button
				type="button"
				onClick={onToggle}
				className="w-full flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
				aria-expanded={isOpen}
			>
				<AccordionSvg className={"w-5 h-5 text-gray-400 "} isOpen={isOpen} />
				<span className="font-semibold text-gray-200">{title}</span>
			</button>
			<div
				data-testid="accordion-content"
				className={`grid transition-[grid-template-rows] duration-200 ease-in-out overflow-hidden ${
					isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				}`}
			>
				<div className="min-h-0">
					{isOpen && (
						<div className="p-4 bg-gray-900 border-t border-gray-700">
							{children}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
