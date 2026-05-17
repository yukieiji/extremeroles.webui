import { Fragment, type ReactNode } from "react";

import { RightPanelItemColumnLayout } from "../parts/RightPanelItemColumnLayout";

interface RightPanelContainerProp<T> {
	arr: T[];
	children: (categoryId: T, withBorder: boolean) => ReactNode;
	ignoreIndex: number;
	depth?: number;
}

export function RightPanelContainer<T>({
	arr,
	children,
	ignoreIndex,
}: RightPanelContainerProp<T>) {
	return (
		<RightPanelItemColumnLayout>
			{arr.map((key, index) => (
				<Fragment key={String(key)}>
					{children(key, index !== ignoreIndex)}
				</Fragment>
			))}
		</RightPanelItemColumnLayout>
	);
}
