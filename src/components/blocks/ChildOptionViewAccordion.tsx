import type { ReactNode } from "react";
import { CLOSE, OPEN } from "@/noTrans";
import { getIndentClass } from "@/logics/indentUtils";
import { AccordionContentContainer } from "../parts/AccordionContentContainer";
import { AccordionSvg } from "../parts/AccordionSvg";
import { OptionRowContainer } from "../parts/OptionRowContainer";

interface ChildOptionViewAccordionProps {
	optionItem: ReactNode;
	isOpen: boolean;
	onToggle: () => void;
	children: ReactNode;
	depth: number;
}

/**
 * 設定可能なオプション自体をヘッダーに持つ、階層構造用の専用アコーディオン
 */
export function ChildOptionViewAccordion({
	optionItem,
	isOpen,
	onToggle,
	children,
	depth,
}: ChildOptionViewAccordionProps) {
	return (
		<div className="flex flex-col">
			<OptionRowContainer
				containerClassName={getIndentClass(depth, 2)}
				leading={
					<div className="flex items-center justify-center w-full h-full">
						<button
							type="button"
							onClick={onToggle}
							className="flex items-center justify-center text-gray-500 hover:text-gray-300 w-full h-full"
							aria-expanded={isOpen}
							aria-label={isOpen ? CLOSE : OPEN}
						>
							<AccordionSvg className={"w-4 h-4"} isOpen={isOpen} />
						</button>
					</div>
				}
				content={optionItem}
			/>

			{/* 子要素（ネストされたオプション） */}
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0">
					{isOpen && <div className="flex flex-col">{children}</div>}
				</div>
			</AccordionContentContainer>
		</div>
	);
}
