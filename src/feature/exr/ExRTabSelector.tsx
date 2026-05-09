import { useEffect, useTransition } from "react";
import { ColoredText } from "@/components/parts/ColoredText";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
		<Tabs
			value={selectedExRTabId.toString()}
			onValueChange={handleValueChange}
			className="w-full"
		>
			<TabsList className="w-full grid grid-cols-4 h-10">
				{Object.keys(exrOptionMetaData.tabs).map((tabId) => {
					const castedTabId = Number(tabId) as ExRTabId;
					return (
						<TabsTrigger key={tabId} value={tabId}>
							<ColoredText
								text={exrOptionMetaData.tabs[castedTabId]?.name ?? ""}
							/>
						</TabsTrigger>
					);
				})}
			</TabsList>
		</Tabs>
	);
}
