import type { ReactNode } from "react";
import { BorderLine } from "../parts/BorderLine";
import { OptionEditorOptionRowGroupLayout } from "../parts/OptionEditorOptionRowLayout";

interface OptionEditorCategoryOptionLayoutProp<T> {
	arr: T[];
	children: (categoryId: T) => ReactNode;
	test_id?: string;
}

export function OptionEditorCategoryOptionLayout<T>({
	arr,
	children,
}: OptionEditorCategoryOptionLayoutProp<T>) {
	return (
		<OptionEditorOptionRowGroupLayout>
			{arr.map((key) => (
				<div key={String(key)}>
					<BorderLine />
					{children(key)}
				</div>
			))}
		</OptionEditorOptionRowGroupLayout>
	);
}
