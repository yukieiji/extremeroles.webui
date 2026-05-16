/**
 * ネストの深さに応じたパディングクラスを返します。
 * Tailwindの動的クラス生成を避けるため、静的なマッピングを使用します。
 *
 * @param depth ネストの深さ (0-indexed)
 * @param step 1段階あたりのパディング量 (4: 1rem, 2: 0.5rem)
 * @returns Tailwindのパディングクラス
 */
export function getIndentClass(depth: number, step: 4 | 2 = 4): string {
	if (depth <= 0) {
		return "";
	}

	if (step === 4) {
		switch (depth) {
			case 1:
				return "pl-4";
			case 2:
				return "pl-8";
			case 3:
				return "pl-12";
			case 4:
				return "pl-16";
			default:
				return "pl-20";
		}
	} else {
		switch (depth) {
			case 1:
				return "pl-2";
			case 2:
				return "pl-4";
			case 3:
				return "pl-6";
			case 4:
				return "pl-8";
			default:
				return "pl-10";
		}
	}
}
