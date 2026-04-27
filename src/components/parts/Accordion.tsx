import type { ReactNode } from "react";

interface AccordionProps {
	title: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	children: ReactNode;
	className?: string;
	headerClassName?: string;
	titleClassName?: string;
	contentClassName?: string;
}

/**
 * ステートレスなアコーディオンコンポーネント
 */
export function Accordion({
	title,
	isOpen,
	onToggle,
	children,
	className = "border border-gray-700 rounded-lg overflow-hidden mb-2",
	headerClassName = "w-full flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left",
	titleClassName = "font-semibold text-gray-200",
	contentClassName = "p-4 bg-gray-900 border-t border-gray-700",
}: AccordionProps) {
	return (
		<div className={className}>
			<button
				type="button"
				onClick={onToggle}
				className={headerClassName}
				aria-expanded={isOpen}
			>
				<AccordionChevron isOpen={isOpen} />
				<span className={titleClassName}>{title}</span>
			</button>
			<AccordionContent isOpen={isOpen} className={contentClassName}>
				{children}
			</AccordionContent>
		</div>
	);
}

export function AccordionChevron({
	isOpen,
	className = "w-5 h-5 transition-transform duration-200 text-gray-400",
}: {
	isOpen: boolean;
	className?: string;
}) {
	return (
		<svg
			className={`${className} ${isOpen ? "rotate-180" : ""}`}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<title>{isOpen ? "Collapse" : "Expand"}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M19 9l-7 7-7-7"
			/>
		</svg>
	);
}

export function AccordionContent({
	isOpen,
	children,
	className = "p-4 bg-gray-900 border-t border-gray-700",
}: {
	isOpen: boolean;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			data-testid="accordion-content"
			className={`grid transition-[grid-template-rows] duration-200 ease-in-out overflow-hidden ${
				isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
			}`}
		>
			<div className="min-h-0">
				{isOpen && <div className={className}>{children}</div>}
			</div>
		</div>
	);
}
