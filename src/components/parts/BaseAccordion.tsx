import type { ReactNode } from "react";

interface BaseAccordionProps {
	title: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	children: ReactNode;
	headerClassName?: string;
	contentClassName?: string;
	containerClassName?: string;
	iconClassName?: string;
	titleClassName?: string;
}

/**
 * アコーディオンの基底コンポーネント
 */
export function BaseAccordion({
	title,
	isOpen,
	onToggle,
	children,
	headerClassName = "",
	contentClassName = "",
	containerClassName = "",
	iconClassName = "",
	titleClassName = "",
}: BaseAccordionProps) {
	return (
		<div
			className={`border border-gray-700 rounded-lg overflow-hidden ${containerClassName}`}
		>
			<button
				type="button"
				onClick={onToggle}
				className={`w-full flex items-center transition-colors text-left ${headerClassName}`}
				aria-expanded={isOpen}
			>
				<svg
					className={`transition-transform duration-200 text-gray-400 ${iconClassName} ${isOpen ? "rotate-180" : ""}`}
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
				<div className={`flex-1 ${titleClassName}`}>{title}</div>
			</button>
			<div
				className={`grid transition-[grid-template-rows] duration-200 ease-in-out overflow-hidden ${
					isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				}`}
			>
				<div className="min-h-0">
					{isOpen && (
						<div
							className={`bg-gray-900 border-t border-gray-700 ${contentClassName}`}
						>
							{children}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
