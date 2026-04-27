import { useEffect, useTransition } from "react";
import { ColoredText } from "../../components/parts/ColoredText";
import { exrOptionMetaData } from "../../logics/api";
import type { OptionTab } from "../../type";
import { useStore } from "../../useStore";

/**
 * ExRオプションのタブ選択コンポーネント
 */
export function ExRTabSelector() {
	const selectedExRTabId = useStore((state) => {
		return state.selectedExRTabId;
	});
	const setSelectedExRTabId = useStore((state) => {
		return state.setSelectedExRTabId;
	});
	const setIsTabPending = useStore((state) => {
		return state.setIsExRTabPending;
	});
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		// トランジションが完了したらペンディング状態を解除する
		if (!isPending) {
			setIsTabPending(false);
		}
	}, [isPending, setIsTabPending]);

	const handleClick = (id: OptionTab) => {
		if (id === selectedExRTabId) {
			return;
		}
		// トランジション開始前に即座にペンディング状態にする
		setIsTabPending(true);
		startTransition(() => {
			setSelectedExRTabId(id);
		});
	};

	return (
		<div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
			{Object.keys(exrOptionMetaData.tabs).map((tabId) => {
				const castedTabId = Number(tabId) as OptionTab;
				return (
					<button
						key={tabId}
						type="button"
						onClick={() => {
							handleClick(castedTabId);
						}}
						className={`
              px-4 py-2 rounded-t-lg transition-colors font-medium
              ${selectedExRTabId === castedTabId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
            `}
					>
						<ColoredText
							text={exrOptionMetaData.tabs[castedTabId]?.name ?? ""}
						/>
					</button>
				);
			})}
		</div>
	);
}
