import { useEffect, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
		<Tabs
			value={selectedAuTabId.toString()}
			onValueChange={handleValueChange}
			className="w-full"
		>
			<TabsList className="w-full grid grid-cols-4 h-10">
				{auOptionMetaData.tabNames.map((name, index) => {
					return (
						<TabsTrigger key={name} value={index.toString()}>
							{name}
						</TabsTrigger>
					);
				})}
			</TabsList>
		</Tabs>
	);
}
