import type { ReactNode } from "react";
import { Suspense } from "react";
import { LoadingCycle } from "../parts/LoadingCycle";

interface EditorContainerProps {
	selector: ReactNode;
	mainView: ReactNode;
}

export function EditorContainer({ selector, mainView }: EditorContainerProps) {
	return (
		<div className="flex flex-col flex-1 overflow-hidden">
			{selector}
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-full min-h-50">
						<LoadingCycle />
					</div>
				}
			>
				{mainView}
			</Suspense>
		</div>
	);
}
