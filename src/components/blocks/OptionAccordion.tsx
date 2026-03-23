import type { ReactNode } from "react";
import { OptionRowContainer } from "./OptionRowContainer";

interface OptionAccordionProps {
	optionItem: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	children: ReactNode;
	showArrow?: boolean;
	className?: string;
}

/**
 * 設定可能なオプション自体をヘッダーに持つ、階層構造用の専用アコーディオン
 */
export function OptionAccordion({
	optionItem,
	isOpen,
	onToggle,
	children,
	showArrow = true,
	className = "",
}: OptionAccordionProps) {
	return (
		<div className={`flex flex-col ${className}`}>
			<OptionRowContainer
				leading={
					<div className="flex items-center justify-center w-full h-full">
						{showArrow ? (
							<button
								type="button"
								onClick={onToggle}
								className="flex items-center justify-center text-gray-500 hover:text-gray-300 w-full h-full"
								aria-expanded={isOpen}
								aria-label={isOpen ? "閉じる" : "開く"}
							>
								<svg
									className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
						) : (
							<span className="text-gray-500 select-none text-xs">・</span>
						)}
					</div>
				}
				content={optionItem}
			/>

			{/* 子要素（ネストされたオプション） */}
			<div
				data-testid="option-accordion-content"
				className={`grid transition-[grid-template-rows] duration-200 ease-in-out overflow-hidden ${
					isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				}`}
			>
				<div className="min-h-0 bg-black/10">
					{isOpen && <div className="flex flex-col">{children}</div>}
				</div>
			</div>
		</div>
	);
}
