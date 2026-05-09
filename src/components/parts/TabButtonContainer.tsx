import type { Key, ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabButtonContainerProps<T extends Key | undefined | null> {
	value: string;
	tabs: T[];
	onValueChange: (value: string) => void;
	getValue: (tab: T, index: number) => string;
	children: (tab: T) => ReactNode;
}

export function TabButtonContainer<T extends Key | undefined | null>({
	value,
	tabs,
	onValueChange,
	getValue,
	children,
}: TabButtonContainerProps<T>) {
	return (
		<Tabs value={value} onValueChange={onValueChange} className="w-full">
			<TabsList className="w-full grid grid-cols-4 h-10">
				{tabs.map((tab, index) => {
					const value = getValue(tab, index);
					return (
						<TabsTrigger key={tab} value={value}>
							{children(tab)}
						</TabsTrigger>
					);
				})}
			</TabsList>
		</Tabs>
	);
}
