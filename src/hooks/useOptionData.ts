import { useShallow } from "zustand/react/shallow";
import type { ExROptionValueData, UniqueOptionId } from "../type";
import { useStore } from "../useStore";

export function useOptionData(
	uniqueOptionId: UniqueOptionId,
): ExROptionValueData {
	return useStore(useShallow((state) => state.valueData[uniqueOptionId]));
}
