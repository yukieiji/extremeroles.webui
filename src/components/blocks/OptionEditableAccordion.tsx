import type { ReactNode } from "react";
import { AccordionContentContainer } from "../parts/AccordionContentContainer";
import { AccordionSvg } from "../parts/AccordionSvg";
import { OptionRowContainer } from "../parts/OptionRowContainer";

interface OptionEditableAccordionProps {
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
export function OptionEditableAccordion({
	optionItem,
	isOpen,
	onToggle,
	children,
	showArrow = true,
	className = "",
}: OptionEditableAccordionProps) {
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
								<AccordionSvg className={"w-4 h-4"} isOpen={isOpen} />
							</button>
						) : (
							<span className="text-gray-500 select-none text-xs">・</span>
						)}
					</div>
				}
				content={optionItem}
			/>

			{/* 子要素（ネストされたオプション） */}
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0 bg-black/10">
					{isOpen && <div className="flex flex-col">{children}</div>}
				</div>
			</AccordionContentContainer>
		</div>
	);
}
