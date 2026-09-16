import type { ReactNode } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { translationMetaData } from "@/logics/api";

interface DisabledControlTooltipProps {
	disabled: boolean;
	tooltipText?: string;
	children: ReactNode;
}

/**
 * コントロールが無効（disabled）な場合にホバー時ツールチップを表示するコンポーネント
 */
export function DisabledControlTooltip({
	disabled,
	tooltipText,
	children,
}: DisabledControlTooltipProps) {
	const text = tooltipText ?? translationMetaData.DISABLED_CONTROL_TOOLTIP;
	if (!disabled) {
		return <>{children}</>;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<span className="inline-block cursor-not-allowed">{children}</span>
				</TooltipTrigger>
				<TooltipContent>{text}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
