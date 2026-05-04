import { Dot } from "lucide-react";
import type { ReactNode } from "react";
import { AccordionContentContainer } from "../parts/AccordionContentContainer";
import { AccordionSvg } from "../parts/AccordionSvg";

interface RoleCategoryAccordionProp {
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
}: RoleCategoryAccordionProp) {
	return (
		<div
			id={typeof text === "string" ? `au-category-${text}` : undefined}
			className="border border-gray-700 rounded-lg overflow-hidden"
			data-testid="role-category"
		>
			<div
				className={`flex items-center bg-gray-800 ${!disable ? "hover:bg-gray-700 transition-colors" : ""}`}
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
						<div className="w-5 h-5 flex items-center justify-center text-gray-500 font-bold">
							<Dot size={20} />
						</div>
					) : (
						<AccordionSvg isOpen={isOpen} className="w-5 h-5 text-gray-400" />
					)}
					<span className="font-semibold text-gray-200">{text}</span>
				</button>

				<div className="flex items-center px-4">{spawnControl}</div>
			</div>
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0">
					{isOpen && (
						<div className="bg-gray-900 border-t border-gray-700">
							{children}
						</div>
					)}
				</div>
			</AccordionContentContainer>
		</div>
	);
}
