import { Dot } from "lucide-react";
import type { ReactNode } from "react";
import { AccordionContentContainer } from "../parts/AccordionContentContainer";
import { AccordionSvg } from "../parts/AccordionSvg";

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
				className={`flex items-center ${!disable ? "hover:bg-gray-100 transition-colors" : ""}`}
			>
				<button
					type="button"
					onClick={() => {
						if (!disable) {
							onClick();
						}
					}}
					className={`flex-1 flex items-center gap-3 p-4 text-left ${disable ? "cursor-default" : ""}`}
					aria-expanded={isOpen}
					disabled={disable}
				>
					{disable ? (
						<div className="w-5 h-5 flex items-center justify-center text-text-tertiary font-bold">
							<Dot size={18} aria-hidden="true" />
						</div>
					) : (
						<AccordionSvg
							isOpen={isOpen}
							className="w-5 h-5 text-text-tertiary"
						/>
					)}
					<span className="font-semibold text-text-primary">{text}</span>
				</button>

				<div className="flex items-center px-4">{spawnControl}</div>
			</div>
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0">
					{isOpen && <div className="border-t border-gray-700">{children}</div>}
				</div>
			</AccordionContentContainer>
		</div>
	);
}
