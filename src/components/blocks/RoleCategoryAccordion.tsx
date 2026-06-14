import { Dot } from "lucide-react";
import type { ReactNode } from "react";
import { TYPOGRAPHY } from "@/designConstants";
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
			className="border border-border-strong rounded-lg overflow-hidden bg-n4-components-background"
			data-testid="role-category"
		>
			<div
				className={`flex items-center ${!disable ? "hover:bg-component-hover transition-colors" : ""}`}
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
						<div className="w-5 h-5 flex items-center justify-center text-text-primary font-bold">
							<Dot size={18} aria-hidden="true" />
						</div>
					) : (
						<AccordionSvg
							isOpen={isOpen}
							className="w-5 h-5 text-text-primary"
						/>
					)}
					<span
						className={`${TYPOGRAPHY.LABEL} font-semibold text-text-primary`}
					>
						{text}
					</span>
				</button>

				<div className="flex items-center px-4">{spawnControl}</div>
			</div>
			<AccordionContentContainer isOpen={isOpen}>
				<div className="min-h-0">
					{isOpen && (
						<div className="border-t border-border-weak">{children}</div>
					)}
				</div>
			</AccordionContentContainer>
		</div>
	);
}
