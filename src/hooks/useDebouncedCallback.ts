import { useEffect, useRef } from "react";

/**
 * コールバック関数をデバウンス（一定時間経過後に実行）するためのフック。
 *
 * @param callback 実行したい関数
 * @param delay デバウンス時間 (ms)
 * @returns デバウンスされた関数
 */
export function useDebouncedCallback<T extends unknown[]>(
	callback: (...args: T) => void,
	delay: number,
) {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// コンポーネントのアンマウント時にタイマーをクリア
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (...args: T) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			callback(...args);
		}, delay);
	};
}
