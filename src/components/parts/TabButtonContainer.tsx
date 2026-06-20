import type { CSSProperties, Key, ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLinearGradient } from "@/logics/colorUtils";

interface TabProps {
	value: string;
	colors: string[];
}

interface TabButtonContainerProps<T extends Key | undefined | null> {
	value: string;
	tabs: T[];
	onValueChange: (value: string) => void;
	getTabProps: (tab: T, index: number) => TabProps;
	children: (tab: T) => ReactNode;
}

export function TabButtonContainer<T extends Key | undefined | null>({
	value,
	tabs,
	onValueChange,
	getTabProps,
	children,
}: TabButtonContainerProps<T>) {
	return (
		<Tabs value={value} onValueChange={onValueChange} className="py-2 w-full">
			<TabsList className="w-full grid grid-cols-4 group-data-horizontal/tabs:h-auto min-h-10">
				{tabs.map((tab, index) => {
					const { value: triggerValue, colors } = getTabProps(tab, index);
					const tabColorStyle =
						colors.length > 0
							? ({
									"--tab-color": getLinearGradient(colors),
								} as CSSProperties)
							: undefined;
					return (
						<TabsTrigger
							key={tab?.toString() ?? index}
							value={triggerValue}
							style={tabColorStyle}
						>
							{children(tab)}
						</TabsTrigger>
					);
				})}
			</TabsList>
		</Tabs>
	);
}
