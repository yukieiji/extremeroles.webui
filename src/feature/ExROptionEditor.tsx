import { Suspense } from "react";
import { ExRCategoryList } from "./ExRCategoryList";
import { ExRTabSelector } from "./ExRTabSelector";


/**
 * ExRオプションを表示するコンポーネント。
 * 子コンポーネントに状態を分散させることで、再レンダリングの範囲を最小限に抑えています。
 */
export function ExROptionEditor() {
	return (
		<div className="flex flex-col gap-4">
			<ExRTabSelector />
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-full min-h-[200px]">
						<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
					</div>
				}
			>
				<ExRCategoryList tabs={data} />
			</Suspense>
		</div>
	);
}
