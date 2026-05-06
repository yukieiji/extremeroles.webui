import { useEffect, useTransition } from "react";
import { TabButton } from "@/components/parts/TabButton";
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
		<TabButtonContainer>
			{auOptionMetaData.tabNames.map((name, index) => {
				return (
					<TabButton
						key={name}
						onClick={() => handleClick(index)}
						isSelect={selectedAuTabId === index}
					>
						{name}
					</TabButton>
				);
			})}
		</TabButtonContainer>
	);
}
