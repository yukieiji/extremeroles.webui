import type { ReactNode } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface DisabledControlTooltipProps {
	disabled: boolean;
	tooltipText?: string;
	children: ReactNode;
}

const DEFAULT_TOOLTIP_TEXT = "前提となるオプションや役職が設定されていません";

/**
 * コントロールが無効（disabled）な場合にホバー時ツールチップを表示するコンポーネント
 */
export function DisabledControlTooltip({
	disabled,
	tooltipText = DEFAULT_TOOLTIP_TEXT,
	children,
}: DisabledControlTooltipProps) {
	if (!disabled) {
		return <>{children}</>;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger
					render={<span className="inline-block cursor-not-allowed" />}
				>
					{children}
				</TooltipTrigger>
				<TooltipContent>{tooltipText}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
