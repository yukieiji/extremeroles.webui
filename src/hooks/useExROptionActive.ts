import { useCallback } from "react";
import type { UniqueOptionId } from "../type";
import { useStore } from "../useStore";

/**
 * 指定されたExRオプションがアクティブかどうかを返すカスタムフック
 */
export function useExROptionActive(uniqueOptionId: UniqueOptionId): boolean {
	return useStore(
		useCallback(
			(state) => state.isExROptionActive[uniqueOptionId],
			[uniqueOptionId],
		),
	);
}
