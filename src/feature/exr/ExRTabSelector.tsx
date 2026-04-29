import { useEffect, useTransition } from "react";
import { ColoredText } from "../../components/parts/ColoredText";
import { TabButton } from "../../components/parts/TabButton";
import { TabButtonContainer } from "../../components/parts/TabButtonContainer";
import { exrOptionMetaData } from "../../logics/api";
import type { TabId } from "../../type";
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

	const handleClick = (id: TabId) => {
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
		<TabButtonContainer>
			{Object.keys(exrOptionMetaData.tabs).map((tabId) => {
				const castedTabId = Number(tabId) as TabId;
				return (
					<TabButton
						key={tabId}
						onClick={() => handleClick(castedTabId)}
						isSelect={selectedExRTabId === castedTabId}
					>
						<ColoredText
							text={exrOptionMetaData.tabs[castedTabId]?.name ?? ""}
						/>
					</TabButton>
				);
			})}
		</TabButtonContainer>
	);
}
