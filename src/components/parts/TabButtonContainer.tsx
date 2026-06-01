import type { Key, ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLinearGradient } from "@/logics/colorUtils";

interface TabButtonContainerProps<T extends Key | undefined | null> {
	value: string;
	tabs: T[];
	onValueChange: (value: string) => void;
	getValue: (tab: T, index: number) => string;
	getColors?: (tab: T, index: number) => string[];
	children: (tab: T) => ReactNode;
}

export function TabButtonContainer<T extends Key | undefined | null>({
	value,
	tabs,
	onValueChange,
	getValue,
	getColors,
	children,
}: TabButtonContainerProps<T>) {
	return (
		<Tabs value={value} onValueChange={onValueChange} className="w-full">
			<TabsList className="w-full grid grid-cols-4 group-data-horizontal/tabs:h-auto min-h-10">
				{tabs.map((tab, index) => {
					const value = getValue(tab, index);
					const colors = getColors?.(tab, index) ?? [];
					const tabColorStyle =
						colors.length > 0
							? ({
									"--tab-color": getLinearGradient(colors),
								} as React.CSSProperties)
							: undefined;
					return (
						<TabsTrigger
							key={tab?.toString() ?? index}
							value={value}
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
