import type { ReactNode } from "react";

import { RightPanelBorderLine } from "../parts/RightPanelBorderLine";
import { RightPanelItemColumnLayout } from "../parts/RightPanelItemColumnLayout";

interface RightPanelContainerProp<T> {
	arr: T[];
	children: (categoryId: T) => ReactNode;
}

export function RightPanelContainer<T>({
	arr,
	children,
}: RightPanelContainerProp<T>) {
	return (
		<RightPanelItemColumnLayout>
			{arr.map((key, index) => (
				<div key={String(key)}>
					{index !== 0 && <RightPanelBorderLine />}
					{children(key)}
				</div>
			))}
		</RightPanelItemColumnLayout>
	);
}
