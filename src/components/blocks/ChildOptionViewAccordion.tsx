import type { ReactNode } from "react";
import { AccordionContentContainer } from "../parts/AccordionContentContainer";
import { AccordionSvg } from "../parts/AccordionSvg";
import { ViewerOptionRowContainer } from "../parts/ViewerOptionRowContainer";

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
			<ViewerOptionRowContainer
				leading={
					<div className="flex items-center justify-center w-full h-full">
						<button
							type="button"
							onClick={onToggle}
							className="flex items-center justify-center text-text-primary w-full h-full"
							aria-expanded={isOpen}
						>
							<AccordionSvg className={"w-4 h-4"} isOpen={isOpen} />
						</button>
					</div>
				}
				content={optionItem}
				depth={depth}
				indentMultiplier={0.5}
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
