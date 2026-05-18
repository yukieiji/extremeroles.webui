import type { StateCreator } from "zustand";

/**
 * スライダーの入力値を一時的に保持するためのスライスのインターフェース
 * 入力中の文字列（空文字や不完全な数値）を許可するためにグローバル状態で管理します。
 */
export interface SliderInputSlice {
	sliderInputs: Record<string, string>;
	setSliderInput: (id: string, value: string) => void;
	clearSliderInput: (id: string) => void;
}

export const createSliderInputSlice: StateCreator<SliderInputSlice> = (set) => {
	return {
		sliderInputs: {},
		setSliderInput: (id, value) => {
			set((state) => ({
				sliderInputs: {
					...state.sliderInputs,
					[id]: value,
				},
			}));
		},
		clearSliderInput: (id) => {
			set((state) => {
				const { [id]: _, ...rest } = state.sliderInputs;
				return { sliderInputs: rest };
			});
		},
	};
};
