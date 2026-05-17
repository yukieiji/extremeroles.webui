import { ChevronRight } from "lucide-react";

interface AccordionSvgProps {
	className: string;
	isOpen: boolean;
}

export function AccordionSvg({ className, isOpen }: AccordionSvgProps) {
	return (
		<ChevronRight
			className={`transition-transform duration-200 ${className} ${isOpen ? "rotate-90" : ""}`}
			aria-hidden="true"
		/>
	);
}
