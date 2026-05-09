import { useEffect, useTransition } from "react";
import { ColoredText } from "@/components/parts/ColoredText";
import { TabButtonContainer } from "@/components/parts/TabButtonContainer";
import { exrOptionMetaData } from "@/logics/api";
import type { ExRTabId } from "@/type";
import { useStore } from "@/useStore";

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

	const handleValueChange = (value: string) => {
		const id = Number(value) as ExRTabId;
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
		<TabButtonContainer
			value={selectedExRTabId.toString()}
			tabs={Object.keys(exrOptionMetaData.tabs)}
			onValueChange={handleValueChange}
			getValue={(t, _) => t}
		>
			{(t) => {
				const castedTabId = Number(t) as ExRTabId;
				return (
					<ColoredText text={exrOptionMetaData.tabs[castedTabId]?.name ?? ""} />
				);
			}}
		</TabButtonContainer>
	);
}
