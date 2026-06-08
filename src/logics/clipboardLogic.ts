import { stripColorTags } from "@/logics/colorUtils";
import {
	AU_IMPOSTOR_COUNT_OPTION_ID,
	AU_KILL_COOLDOWN_OPTION_ID,
	AU_MAP_OPTION_ID,
	EXR_CREW_MAX_ID,
	EXR_CREW_MIN_ID,
	EXR_IMPOSTOR_MAX_ID,
	EXR_IMPOSTOR_MIN_ID,
	EXR_LIBERAL_MAX_ID,
	EXR_LIBERAL_MIN_ID,
	EXR_MILITANT_MAX_ID,
	EXR_MILITANT_MIN_ID,
	EXR_NEUTRAL_MAX_ID,
	EXR_NEUTRAL_MIN_ID,
	EXR_RANDOM_MAP_OPTION_ID,
	getUniqueOptionId,
	PRESET_OPTION_UNIQUE_ID,
	VANILLA_ROLE_CATEGORY_IDS,
} from "@/logics/optionUtils";
import { RANDOM_MAP_LABEL } from "@/noTrans";
import {
	type AuOptionId,
	type AuOptionMetaDataRecords,
	type ExROptionMetaDataRecords,
	type ExROptionValueData,
	ExRTabId,
	SPAWN_COUNT_OPTION_ID,
	SPAWN_RATE_OPTION_ID,
	type UniqueOptionId,
} from "@/type";

interface ClipboardState {
	exrValue: Record<UniqueOptionId, ExROptionValueData>;
	auValue: Record<AuOptionId, number>;
	isExROptionActive: Record<UniqueOptionId, boolean>;
	presetNames: Record<number, string>;
}

export function generateClipboardText(
	state: ClipboardState,
	exrMeta: ExROptionMetaDataRecords,
	auMeta: AuOptionMetaDataRecords,
) {
	const getExRValue = (uniqueId: UniqueOptionId) => {
		const data = state.exrValue[uniqueId];
		if (!data) {
			return null;
		}
		return data.values[data.selection];
	};

	const getExRFormattedValue = (uniqueId: UniqueOptionId) => {
		const data = state.exrValue[uniqueId];
		if (!data) {
			return "";
		}
		const value = data.values[data.selection];
		const meta = exrMeta.options[uniqueId]?.metaData;
		if (!meta?.format) {
			return String(value);
		}
		return meta.format.replace("{0}", String(value));
	};

	const getAuValue = (optionId: AuOptionId) => {
		const selection = state.auValue[optionId] ?? 0;
		return auMeta.options[optionId]?.range[selection];
	};

	// 1. プリセット名
	const presetSelection =
		state.exrValue[PRESET_OPTION_UNIQUE_ID]?.selection ?? 0;
	const presetName =
		state.presetNames[presetSelection] ??
		String(getExRValue(PRESET_OPTION_UNIQUE_ID) ?? "");

	// 2. マップ
	let mapName = String(getAuValue(AU_MAP_OPTION_ID) ?? "");
	if (state.exrValue[EXR_RANDOM_MAP_OPTION_ID]?.selection === 1) {
		mapName = RANDOM_MAP_LABEL;
	}

	// 3. キルクール
	const killCooldown = String(getAuValue(AU_KILL_COOLDOWN_OPTION_ID) ?? "");

	// 4. 陣営数
	const getMinMax = (minId: UniqueOptionId, maxId: UniqueOptionId) => {
		const min = getExRValue(minId);
		const max = getExRValue(maxId);
		return min === max ? `${min}` : `${min} - ${max}`;
	};

	const crewRolesCount = getMinMax(EXR_CREW_MIN_ID, EXR_CREW_MAX_ID);
	const impostorRolesCount = getMinMax(
		EXR_IMPOSTOR_MIN_ID,
		EXR_IMPOSTOR_MAX_ID,
	);
	const impostorCount = String(getAuValue(AU_IMPOSTOR_COUNT_OPTION_ID) ?? "");
	const neutralRolesCount = getMinMax(EXR_NEUTRAL_MIN_ID, EXR_NEUTRAL_MAX_ID);
	const liberalRolesCount = getMinMax(EXR_LIBERAL_MIN_ID, EXR_LIBERAL_MAX_ID);
	const militantRolesCount = getMinMax(
		EXR_MILITANT_MIN_ID,
		EXR_MILITANT_MAX_ID,
	);

	// 5. 役職リスト
	const getRolesForTab = (tabId: ExRTabId) => {
		const roles: {
			name: string;
			rate: string;
			count: string;
			isVanilla: boolean;
		}[] = [];
		const tab = exrMeta.tabs[tabId];
		if (!tab) {
			return roles;
		}

		for (const catId of tab.categoryIds) {
			const category = exrMeta.categories[catId];
			if (!category) {
				continue;
			}

			// ExR役職
			const spawnRateId = getUniqueOptionId(tabId, catId, SPAWN_RATE_OPTION_ID);
			const spawnCountId = getUniqueOptionId(
				tabId,
				catId,
				SPAWN_COUNT_OPTION_ID,
			);

			const rate = getExRValue(spawnRateId);
			if (typeof rate === "number" && rate > 0) {
				roles.push({
					name: stripColorTags(category.name),
					rate: getExRFormattedValue(spawnRateId),
					count: getExRFormattedValue(spawnCountId),
					isVanilla: false,
				});
			}
		}
		return roles;
	};

	// バニラ役職の取得
	const getVanillaRoles = () => {
		const roles: {
			name: string;
			rate: string;
			count: string;
			isVanilla: boolean;
			faction: "Crew" | "Impostor" | "Neutral";
		}[] = [];
		for (const catId of VANILLA_ROLE_CATEGORY_IDS) {
			const catMeta = auMeta.categoryMetaData[catId];
			if (!catMeta) {
				continue;
			}
			const chanceId = catMeta.options[0];
			const maxCountId = catMeta.options[1];
			const chance = Number(getAuValue(chanceId) ?? 0);
			const maxCount = Number(getAuValue(maxCountId) ?? 0);

			if (chance > 0 && maxCount > 0) {
				let faction: "Crew" | "Impostor" | "Neutral" = "Crew";
				if (catMeta.tabId === 1) {
					faction = "Impostor";
				}
				if (catMeta.tabId === 2) {
					faction = "Neutral";
				}

				roles.push({
					name: stripColorTags(catMeta.name),
					rate: `${chance}%`,
					count: `${maxCount}`,
					isVanilla: true,
					faction,
				});
			}
		}
		return roles;
	};

	const vanillaRoles = getVanillaRoles();
	const crewRolesList = [
		...getRolesForTab(ExRTabId.CrewmateTab),
		...vanillaRoles.filter((r) => r.faction === "Crew"),
	];
	const impostorRolesList = [
		...getRolesForTab(ExRTabId.ImpostorTab),
		...vanillaRoles.filter((r) => r.faction === "Impostor"),
	];
	const neutralRolesList = [
		...getRolesForTab(ExRTabId.NeutralTab),
		...vanillaRoles.filter((r) => r.faction === "Neutral"),
	];

	const liberalRolesList = getRolesForTab(ExRTabId.GeneralTab);

	const formatRoleTable = (
		roles: { name: string; rate: string; count: string; isVanilla: boolean }[],
	) => {
		if (roles.length === 0) {
			return "";
		}
		let table = "|  役職名  | スポーンレート | スポーン数 |\n| | | |\n";
		for (const role of roles) {
			const name = role.isVanilla ? `${role.name}※バニラ` : role.name;
			table += `| ${name} | ${role.rate} | ${role.count} |\n`;
		}
		return table;
	};

	// 詳細設定の構築
	let detailedSettings = "| 設定項目 | 値 |\n| | |\n";

	// Au Tab 0
	const auTab0Categories = auMeta.tabCategoryMap[0] || [];
	for (const catId of auTab0Categories) {
		const catMeta = auMeta.categoryMetaData[catId];
		// サマリーにあるものは除く
		if (catId === 0) {
			continue; // Map category (approx)
		}

		for (const optId of catMeta.options) {
			if (
				optId === AU_MAP_OPTION_ID ||
				optId === AU_KILL_COOLDOWN_OPTION_ID ||
				optId === AU_IMPOSTOR_COUNT_OPTION_ID
			) {
				continue;
			}
			const meta = auMeta.options[optId];
			if (!meta) {
				continue;
			}
			const value = getAuValue(optId);
			detailedSettings += `| ${stripColorTags(meta.title)} | ${value}${
				meta.format ? meta.format.replace("{0}", "") : ""
			} |\n`;
		}
	}

	// ExR General Tab
	const exrGeneralTab = exrMeta.tabs[ExRTabId.GeneralTab];
	if (exrGeneralTab) {
		for (const catId of exrGeneralTab.categoryIds) {
			const category = exrMeta.categories[catId];
			if (!category) {
				continue;
			}

			const topLevelOptionIds =
				exrMeta.globalCategoryIdTopLevelMap[catId] || [];
			for (const optId of topLevelOptionIds) {
				// サマリーにあるものは除く
				if (
					[
						PRESET_OPTION_UNIQUE_ID,
						EXR_CREW_MIN_ID,
						EXR_CREW_MAX_ID,
						EXR_IMPOSTOR_MIN_ID,
						EXR_IMPOSTOR_MAX_ID,
						EXR_NEUTRAL_MIN_ID,
						EXR_NEUTRAL_MAX_ID,
						EXR_LIBERAL_MIN_ID,
						EXR_LIBERAL_MAX_ID,
						EXR_MILITANT_MIN_ID,
						EXR_MILITANT_MAX_ID,
						EXR_RANDOM_MAP_OPTION_ID,
					].includes(optId)
				) {
					continue;
				}

				if (state.isExROptionActive[optId]) {
					const meta = exrMeta.options[optId]?.metaData;
					if (!meta) {
						continue;
					}
					detailedSettings += `| ${stripColorTags(
						meta.translatedName,
					)} | ${getExRFormattedValue(optId)} |\n`;
				}
			}
		}
	}

	let text = `# 設定(${presetName})\n`;
	text += `- マップ: ${mapName}\n`;
	text += `- キルクールダウン時間: ${killCooldown}\n`;
	text += `## 陣営数\n`;
	text += `- クルーのロール数: ${crewRolesCount}\n`;
	text += `- インポスターのロール数: ${impostorRolesCount}\n`;
	text += `  - インポスター数: ${impostorCount}\n`;
	text += `- 第3陣営のロール数: ${neutralRolesCount}\n`;
	if (liberalRolesCount !== "0") {
		text += `- リベラルのロール数: ${liberalRolesCount}\n`;
		text += `  - ミリタントのロール数: ${militantRolesCount}\n`;
	}

	text += "## 役職\n";
	if (crewRolesList.length > 0) {
		text += `### クルー\n${formatRoleTable(crewRolesList)}\n`;
	}
	if (impostorRolesList.length > 0) {
		text += `### インポスター\n${formatRoleTable(impostorRolesList)}\n`;
	}
	if (neutralRolesList.length > 0) {
		text += `### ニュートラル\n${formatRoleTable(neutralRolesList)}\n`;
	}
	if (liberalRolesList.length > 0) {
		text += `### リベラル\n${formatRoleTable(liberalRolesList)}\n`;
	}

	text += `\n## 詳細設定\n<summary>\n${detailedSettings}\n</summary>\n`;
	text += "\n## その他\n※ : 何かあればここに書くとよろし\n";

	return text;
}
