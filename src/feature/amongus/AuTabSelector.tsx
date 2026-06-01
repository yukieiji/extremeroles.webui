import { useEffect, useTransition } from "react";
import { TabButtonContainer } from "@/components/parts/TabButtonContainer";
import { auOptionMetaData } from "@/logics/api";
import { useStore } from "@/useStore";

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

	const handleValueChange = (value: string) => {
		const id = Number(value);
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
		<TabButtonContainer
			value={selectedAuTabId.toString()}
			tabs={auOptionMetaData.tabNames}
			onValueChange={handleValueChange}
			getTabProps={(_, index) => {
				const color = auOptionMetaData.tabColors[index];
				return {
					value: index.toString(),
					colors: color ? [color] : [],
				};
			}}
		>
			{(t) => t}
		</TabButtonContainer>
	);
}
