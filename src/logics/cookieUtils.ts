/**
 * クッキーを取得する
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameLenPlus = name.length + 1;
  return (
    document.cookie
      .split(';')
      .map((c) => c.trim())
      .filter((cookie) => {
        return cookie.substring(0, nameLenPlus) === `${name}=`;
      })
      .map((cookie) => {
        return decodeURIComponent(cookie.substring(nameLenPlus));
      })[0] || null
  );
}

/**
 * クッキーを設定する
 */
export function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
}

const PRESET_NAMES_COOKIE_NAME = 'exr_preset_names';

/**
 * プリセット名のリストをクッキーに保存する
 */
export function savePresetNamesToCookie(names: Record<number, string>) {
  setCookie(PRESET_NAMES_COOKIE_NAME, JSON.stringify(names));
}

/**
 * プリセット名のリストをクッキーから読み込む
 */
export function loadPresetNamesFromCookie(): Record<number, string> {
  const cookieValue = getCookie(PRESET_NAMES_COOKIE_NAME);
  if (!cookieValue) return {};
  try {
    const parsed = JSON.parse(cookieValue);
    // キーを数値に変換して返す
    const result: Record<number, string> = {};
    for (const key in parsed) {
      result[Number(key)] = parsed[key];
    }
    return result;
  } catch (e) {
    console.error('Failed to parse preset names from cookie', e);
    return {};
  }
}
