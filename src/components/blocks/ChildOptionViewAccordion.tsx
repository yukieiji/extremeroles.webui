import type { ReactNode } from "react";
import { CLOSE, OPEN } from "@/noTrans";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
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
		<div className={`flex flex-col ${depth > 0 ? "pl-2" : ""}`}>
			<Accordion
				value={isOpen ? ["item-1"] : []}
				onValueChange={(value) => {
					if (value.includes("item-1") && !isOpen) {
						onToggle();
					} else if (!value.includes("item-1") && isOpen) {
						onToggle();
					}
				}}
			>
				<AccordionItem value="item-1">
					<OptionRowContainer
						leading={
							<div className="flex items-center justify-center w-full h-full">
								<AccordionTrigger
									className="flex items-center justify-center text-gray-500 hover:text-gray-300 w-full h-full p-0 gap-0 justify-items-center hover:no-underline [&>div>svg]:size-4"
									aria-label={isOpen ? CLOSE : OPEN}
								/>
							</div>
						}
						content={optionItem}
					/>

					{/* 子要素（ネストされたオプション） */}
					<AccordionContent className="p-0 pb-0">
						<div className="flex flex-col">{children}</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
