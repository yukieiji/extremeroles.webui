import type { ReactNode } from "react";
import { AccordionContentContainer } from "../parts/AccordionContentContainer";

interface RowCustomizeAccordionProps {
	row: ReactNode;
	isOpen: boolean;
	children: ReactNode;
	depth: number;
}

/**
 * 設定可能なオプション自体をヘッダーに持つ、階層構造用の専用アコーディオン
 */
export function RowCustomizeAccordion({
	isOpen,
	row,
	children,
	depth,
}: RowCustomizeAccordionProps) {
	return (
		<div className="flex flex-col">
			{row}
			{/* 子要素（ネストされたオプション） */}
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0">
					{isOpen && <div className="flex flex-col">{children}</div>}
				</div>
			</AccordionContentContainer>
		</div>
	);
}
