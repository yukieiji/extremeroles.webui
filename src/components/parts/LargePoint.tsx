import { Dot } from "lucide-react";
import { TYPOGRAPHY } from "@/designConstants";

export function LargePoint() {
	return (
		<span
			className={`text-text-primary select-none ${TYPOGRAPHY.SMALL} inline-flex items-center`}
		>
			<Dot size={18} aria-hidden="true" />
		</span>
	);
}
