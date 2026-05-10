import type { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem } from "../ui/accordion";

interface RowCustomizeAccordionProps {
	row: ReactNode;
	isOpen: boolean;
	onToggle?: () => void;
	children: ReactNode;
	depth: number;
}

/**
 * 設定可能なオプション自体をヘッダーに持つ、階層構造用の専用アコーディオン
 */
export function RowCustomizeAccordion({
	isOpen,
	onToggle,
	row,
	children,
	depth,
}: RowCustomizeAccordionProps) {
	return (
		<div className={`flex flex-col ${depth > 0 ? "pl-4" : ""}`}>
			<Accordion value={isOpen ? ["item-1"] : []} onValueChange={onToggle}>
				<AccordionItem value="item-1">
					{row}
					{/* 子要素（ネストされたオプション） */}
					<AccordionContent className="p-0 pb-0">
						<div className="flex flex-col">{children}</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
