import { Dot } from "lucide-react";
import type { ReactNode } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";

interface RoleCategoryAccordionProps {
	isOpen: boolean;
	onClick: () => void;
	text: ReactNode;
	spawnControl: ReactNode;
	disable: boolean;
	children: ReactNode;
}

export function RoleCategoryAccordion({
	isOpen,
	onClick,
	text,
	spawnControl,
	disable,
	children,
}: RoleCategoryAccordionProps) {
	return (
		<div
			id={typeof text === "string" ? `au-category-${text}` : undefined}
			className="border border-gray-700 rounded-lg overflow-hidden"
			data-testid="role-category"
		>
			<div
				className={`flex items-center ${!disable ? "hover:bg-gray-700 transition-colors" : ""}`}
			>
				<Accordion
					value={isOpen && !disable ? ["item-1"] : []}
					onValueChange={(value) => {
						if (!disable) {
							if (value.includes("item-1") && !isOpen) {
								onClick();
							} else if (!value.includes("item-1") && isOpen) {
								onClick();
							}
						}
					}}
					className="flex-1"
				>
					<AccordionItem value="item-1">
						<AccordionTrigger
							className={`flex-1 flex items-center gap-3 p-4 text-left hover:no-underline [&>div>svg]:${disable ? "hidden" : "text-gray-400 size-5"} ${disable ? "cursor-default opacity-50" : ""}`}
							disabled={disable}
						>
							{disable && (
								<div className="w-5 h-5 flex items-center justify-center text-gray-500 font-bold">
									<Dot size={18} aria-hidden="true" />
								</div>
							)}
							<span className="font-semibold text-gray-200">{text}</span>
						</AccordionTrigger>
						<AccordionContent className="p-0 pb-0">
							<div className="border-t border-gray-700">{children}</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<div className="flex items-center px-4">{spawnControl}</div>
			</div>
		</div>
	);
}
