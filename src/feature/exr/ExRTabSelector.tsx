import { useEffect, useTransition } from "react";
import { ColoredText } from "../../components/parts/ColoredText";
import { TabButton } from "../../components/parts/TabButton";
import { TabButtonContainer } from "../../components/parts/TabButtonContainer";
import { exrOptionMetaData } from "../../logics/api";
import { OptionTab, type TabId } from "../../type";
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
			{Object.values(OptionTab).map((tabId) => {
				const tabMeta = exrOptionMetaData.tabs[tabId];
				if (!tabMeta) {
					return null;
				}

				return (
					<TabButton
						key={tabId}
						onClick={() => handleClick(tabId)}
						isSelect={selectedExRTabId === tabId}
					>
						<ColoredText text={tabMeta.name} />
					</TabButton>
				);
			})}
		</TabButtonContainer>
	);
}
