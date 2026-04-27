import { useEffect, useTransition } from "react";
import { auOptionMetaData } from "../../logics/api";
import { useStore } from "../../useStore";

/**
 * Auオプションのタブ選択コンポーネント
 */
export function AuTabSelector() {
	const selectedAuTabId = useStore((state) => {
		return state.selectedAuTabId;
	});
	const setSelectedAuTabId = useStore((state) => {
		return state.setSelectedAuTabId;
	});
	const setIsTabPending = useStore((state) => {
		return state.setIsAuTabPending;
	});
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		// トランジションが完了したらペンディング状態を解除する
		if (!isPending) {
			setIsTabPending(false);
		}
	}, [isPending, setIsTabPending]);

	const handleClick = (id: number) => {
		if (id === selectedAuTabId) {
			return;
		}
		// トランジション開始前に即座にペンディング状態にする
		setIsTabPending(true);
		startTransition(() => {
			setSelectedAuTabId(id);
		});
	};

	return (
		<div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
			{auOptionMetaData.tabNames.map((name, index) => {
				return (
					<button
						key={name}
						type="button"
						onClick={() => {
							handleClick(index);
						}}
						className={`
              px-4 py-2 rounded-t-lg transition-colors font-medium
              ${selectedAuTabId === index ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}
            `}
					>
						{name}
					</button>
				);
			})}
		</div>
	);
}
