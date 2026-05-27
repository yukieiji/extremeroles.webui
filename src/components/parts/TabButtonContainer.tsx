import type { Key, ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabButtonContainerProps<T extends Key | undefined | null> {
	value: string;
	tabs: T[];
	onValueChange: (value: string) => void;
	getValue: (tab: T, index: number) => string;
	getTriggerProps?: (tab: T, index: number) => Record<string, unknown>;
	children: (tab: T) => ReactNode;
}

export function TabButtonContainer<T extends Key | undefined | null>({
	value,
	tabs,
	onValueChange,
	getValue,
	getTriggerProps,
	children,
}: TabButtonContainerProps<T>) {
	return (
		<Tabs value={value} onValueChange={onValueChange} className="w-full">
			<TabsList
				variant="line"
				className="w-full grid grid-cols-4 group-data-horizontal/tabs:h-auto min-h-10"
			>
				{tabs.map((tab, index) => {
					const val = getValue(tab, index);
					const extraProps = getTriggerProps?.(tab, index) ?? {};
					return (
						<TabsTrigger key={tab} value={val} {...extraProps}>
							{children(tab)}
						</TabsTrigger>
					);
				})}
			</TabsList>
		</Tabs>
	);
}
