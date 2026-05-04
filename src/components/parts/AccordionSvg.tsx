import { ChevronDown } from "lucide-react";
import { CLOSE, OPEN } from "../../noTrans";

interface AccordionSvgProp {
	className: string;
	isOpen: boolean;
}

export function AccordionSvg({ className, isOpen }: AccordionSvgProp) {
	return (
		<ChevronDown
			className={`transition-transform duration-200 ${className} ${isOpen ? "rotate-180" : ""}`}
			aria-hidden="true"
		/>
	);
}
