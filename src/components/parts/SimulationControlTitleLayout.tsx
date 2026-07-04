import { TYPOGRAPHY } from "@/designConstants";
import { Separator } from "../ui/separator";

interface SimulationControlTitleLayoutProps {
	text: string;
}

/**
 * ハイライト状態を表示するためのラッパーコンポーネント
 */
export function SimulationControlTitleLayout({
	text,
}: SimulationControlTitleLayoutProps) {
	return (
		<>
			<span className={`${TYPOGRAPHY.LABEL} text-text-primary mx-auto pt-4`}>
				{text}
			</span>
			<Separator />
		</>
	);
}
