import type { ReactNode } from "react";

import { RightPanelBorderLine } from "../parts/RightPanelBorderLine";
import { RightPanelItemColumnLayout } from "../parts/RightPanelItemColumnLayout";

interface RightPanelContainerProp<T> {
	arr: T[];
	children: (categoryId: T) => ReactNode;
	ignoreIndex: number;
	depth?: number;
}

export function RightPanelContainer<T>({
	arr,
	children,
	ignoreIndex,
	depth = 0,
}: RightPanelContainerProp<T>) {
	return (
		<RightPanelItemColumnLayout>
			{arr.map((key, index) => (
				<div key={String(key)}>
					{index !== ignoreIndex && <RightPanelBorderLine depth={depth} />}
					{children(key)}
				</div>
			))}
		</RightPanelItemColumnLayout>
	);
}
