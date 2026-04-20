import { useStore } from "../useStore";

export function useBlock(): (func: () => void) => void {
	const pushBlock = useStore((state) => state.pushBlockCount);
	const popBlock = useStore((state) => state.popBlockCount);

	return (func) => {
		pushBlock();
		func();
		popBlock();
	};
}

export function useBlockAsync(): (func: () => Promise<void>) => Promise<void> {
	const pushBlock = useStore((state) => state.pushBlockCount);
	const popBlock = useStore((state) => state.popBlockCount);

	return async (func) => {
		pushBlock();
		await func();
		popBlock();
	};
}
