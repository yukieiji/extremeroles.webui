import { Fragment, type ReactNode } from "react";
import { OptionEditorOptionRowGroupLayout } from "../parts/OptionEditorOptionRowLayout";

interface OptionEditorCategoryOptionLayoutProp<T> {
	arr: T[];
	children: (categoryId: T, withBorder: boolean) => ReactNode;
	ignoreIndex: number;
	depth?: number;
}

export function OptionEditorCategoryOptionLayout<T>({
	arr,
	children,
	ignoreIndex,
}: OptionEditorCategoryOptionLayoutProp<T>) {
	return (
		<OptionEditorOptionRowGroupLayout>
			{arr.map((key, index) => (
				<Fragment key={String(key)}>
					{children(key, index !== ignoreIndex)}
				</Fragment>
			))}
		</OptionEditorOptionRowGroupLayout>
	);
}
