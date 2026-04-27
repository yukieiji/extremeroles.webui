interface AccordionSvgProp {
	className: string;
	isOpen: boolean;
}

export function AccordionSvg({ className, isOpen }: AccordionSvgProp) {
	return (
		<svg
			className={`transition-transform duration-200 ${className} ${isOpen ? "rotate-180" : ""}`}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<title>{isOpen ? "Collapse" : "Expand"}</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M19 9l-7 7-7-7"
			/>
		</svg>
	);
}
