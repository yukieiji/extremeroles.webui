import type { ReactNode } from "react";
import { BorderLine } from "../parts/BorderLine";
import { OptionEditorOptionRowGroupLayout } from "../parts/OptionEditorOptionRowLayout";

interface OptionEditorCategoryOptionLayoutProp<T> {
	arr: T[];
	children: (categoryId: T) => ReactNode;
	ignoreIndex: number;
	depth?: number;
}

export function OptionEditorCategoryOptionLayout<T>({
	arr,
	children,
	ignoreIndex,
	depth = 0,
}: OptionEditorCategoryOptionLayoutProp<T>) {
	return (
		<OptionEditorOptionRowGroupLayout>
			{arr.map((key, index) => (
				<div key={String(key)}>
					{index !== ignoreIndex && <BorderLine depth={depth} />}
					{children(key)}
				</div>
			))}
		</OptionEditorOptionRowGroupLayout>
	);
}
