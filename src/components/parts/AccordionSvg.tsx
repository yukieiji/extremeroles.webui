import { ChevronDown } from "lucide-react";

interface AccordionSvgProps {
	className: string;
	isOpen: boolean;
}

export function AccordionSvg({ className, isOpen }: AccordionSvgProps) {
	return (
		<ChevronDown
			className={`transition-transform duration-200 ${className} ${isOpen ? "rotate-180" : ""}`}
			aria-hidden="true"
		/>
	);
}
