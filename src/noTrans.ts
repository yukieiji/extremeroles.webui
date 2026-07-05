/**
 * 翻訳されていない日本語テキストの定数定義
 */

export const AU_OPTIONS_TITLE = "Among Us";
export const EXR_OPTIONS_TITLE = "Extreme Roles";
export const AU_SHORT_LABEL = "A";
export const EXR_SHORT_LABEL = "E";

export const SIMULATE_LABEL = "シミュレート";

export const SIMULATE_RESULT_HEADER = "### シミュレート結果\n";
export const RESULT_TITLE = "結果";
export const COPY_BUTTON_LABEL = "コピー";
export const PLAYER_NAME_HEADER = "プレイヤーネーム";
export const ROLE_NAME_HEADER = "役職";
export const DETAILS_SETTING_TITLE = "詳細設定";
export const LOBBY_INFO_TITLE = "ロビー情報";
export const CYCLE_LABEL = "Cycle";
export const PLAYER_NUM_LABEL = "Player Num";
export const EMPTY_SIMULATE_MESSAGE = "シュミレートボタンを押して下さい";
export const EXECUTING_LABEL = "Executing...";
export const EXECUTE_BUTTON_LABEL = "Execute";

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
