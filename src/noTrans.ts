/**
 * 翻訳されていない日本語テキストの定数定義
 */

export const AU_OPTIONS_TITLE = "Among Us";
export const EXR_OPTIONS_TITLE = "Extreme Roles";
export const AU_SHORT_LABEL = "A";
export const EXR_SHORT_LABEL = "E";


export const MAP_NAMES: Record<number, string> = {
	0: "Skeld",
	1: "MIRA HQ",
	2: "Polus",
	4: "The AirShip",
	5: "The Fungle",
};

/**
 * マップIDをマップ名に変換します。
 * 登録されていないIDの場合は数値の文字列を返します。
 */
export function getMapName(mapId: number): string {
	return MAP_NAMES[mapId] ?? String(mapId);
}
