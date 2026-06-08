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
	getBaseOptionName,
	getUniqueOptionId,
	MOVED_EXR_OPTION_UNIQUE_IDS,
	PRESET_OPTION_UNIQUE_ID,
	VANILLA_ROLE_CATEGORY_IDS,
} from "@/logics/optionUtils";
import {
	CLIPBOARD_CREW,
	CLIPBOARD_DETAILED_SETTINGS,
	CLIPBOARD_FACTION_COUNTS,
	CLIPBOARD_IMPOSTOR,
	CLIPBOARD_LIBERAL,
	CLIPBOARD_NEUTRAL,
	CLIPBOARD_OTHERS,
	CLIPBOARD_OTHERS_NOTE,
	CLIPBOARD_ROLES,
	CLIPBOARD_SETTING_TITLE,
	CLIPBOARD_VANILLA_SUFFIX,
	RANDOM_MAP_LABEL,
} from "@/noTrans";
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

export interface ClipboardState {
	exrValue: Record<UniqueOptionId, ExROptionValueData>;
	auValue: Record<AuOptionId, number>;
	isExROptionActive: Record<UniqueOptionId, boolean>;
	presetNames: Record<number, string>;
}

/**
 * カラータグを除去し、改行をスペースに置換します
 */
function cleanText(text: string): string {
	if (!text) {
		return "";
	}
	return stripColorTags(text).replace(/\r?\n/g, " ");
}

export function generateClipboardText(
	state: ClipboardState,
	exrMeta: ExROptionMetaDataRecords,
	auMeta: AuOptionMetaDataRecords,
): string {
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
			return cleanText(String(value));
		}
		let formatted = "";
		if (meta.format.includes("{0}")) {
			formatted = meta.format.replace("{0}", String(value));
		} else {
			// {0}が含まれていない場合（例: "%" のみ）、値を前に付ける
			formatted = `${value}${meta.format}`;
		}
		return cleanText(formatted);
	};

	const getAuValue = (optionId: AuOptionId) => {
		const selection = state.auValue[optionId] ?? 0;
		return auMeta.options[optionId]?.range[selection];
	};

	// 1. プリセット名
	const presetSelection =
		state.exrValue[PRESET_OPTION_UNIQUE_ID]?.selection ?? 0;
	const presetName = cleanText(
		state.presetNames[presetSelection] ??
			String(getExRValue(PRESET_OPTION_UNIQUE_ID) ?? ""),
	);

	// 2. マップ
	const mapTitle = cleanText(auMeta.options[AU_MAP_OPTION_ID].title);
	let mapValue = cleanText(String(getAuValue(AU_MAP_OPTION_ID) ?? ""));
	if (state.exrValue[EXR_RANDOM_MAP_OPTION_ID]?.selection === 1) {
		mapValue = RANDOM_MAP_LABEL;
	}

	// 3. キルクール
	const killCooldownTitle = cleanText(
		auMeta.options[AU_KILL_COOLDOWN_OPTION_ID].title,
	);
	const killCooldownValue = cleanText(
		String(getAuValue(AU_KILL_COOLDOWN_OPTION_ID) ?? ""),
	);

	// 4. 陣営数
	const getMinMax = (minId: UniqueOptionId, maxId: UniqueOptionId) => {
		const minOption = state.exrValue[minId];
		const maxOption = state.exrValue[maxId];
		const min = minOption?.values[minOption?.selection ?? 0] ?? 0;
		const max = maxOption?.values[maxOption?.selection ?? 0] ?? 0;
		return min === max ? `${min}` : `${min} - ${max}`;
	};

	const getExRLabel = (uniqueId: UniqueOptionId) => {
		const meta = exrMeta.options[uniqueId].metaData;
		return cleanText(getBaseOptionName(meta.translatedName));
	};

	const crewRolesLabel = getExRLabel(EXR_CREW_MIN_ID);
	const crewRolesCount = getMinMax(EXR_CREW_MIN_ID, EXR_CREW_MAX_ID);

	const impostorRolesLabel = getExRLabel(EXR_IMPOSTOR_MIN_ID);
	const impostorRolesCount = getMinMax(
		EXR_IMPOSTOR_MIN_ID,
		EXR_IMPOSTOR_MAX_ID,
	);

	const impostorCountTitle = cleanText(
		auMeta.options[AU_IMPOSTOR_COUNT_OPTION_ID].title,
	);
	const impostorCountValue = cleanText(
		String(getAuValue(AU_IMPOSTOR_COUNT_OPTION_ID) ?? ""),
	);

	const neutralRolesLabel = getExRLabel(EXR_NEUTRAL_MIN_ID);
	const neutralRolesCount = getMinMax(EXR_NEUTRAL_MIN_ID, EXR_NEUTRAL_MAX_ID);

	const liberalRolesLabel = getExRLabel(EXR_LIBERAL_MIN_ID);
	const liberalRolesCount = getMinMax(EXR_LIBERAL_MIN_ID, EXR_LIBERAL_MAX_ID);

	const militantRolesLabel = getExRLabel(EXR_MILITANT_MIN_ID);
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
					name: cleanText(category.name),
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
			faction: "Crew" | "Impostor";
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
				const faction: "Crew" | "Impostor" =
					catMeta.tabId === 2 ? "Impostor" : "Crew";

				roles.push({
					name: cleanText(catMeta.name),
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
		...vanillaRoles.filter((r) => r.faction === "Crew"),
		...getRolesForTab(ExRTabId.CrewmateTab),
	];
	const impostorRolesList = [
		...vanillaRoles.filter((r) => r.faction === "Impostor"),
		...getRolesForTab(ExRTabId.ImpostorTab),
	];
	const neutralRolesList = getRolesForTab(ExRTabId.NeutralTab);

	const liberalRolesList = getRolesForTab(ExRTabId.GeneralTab);

	const formatRoleList = (
		roles: { name: string; rate: string; count: string; isVanilla: boolean }[],
	) => {
		if (roles.length === 0) {
			return "";
		}
		let list = "";
		for (const role of roles) {
			const name = role.isVanilla
				? `${role.name}(${CLIPBOARD_VANILLA_SUFFIX})`
				: role.name;
			// - {役職名}{※バニラ} - {スポーン数} / {スポーンレート}％
			// ％が重複しないように調整
			const rate = role.rate.endsWith("%")
				? role.rate.slice(0, -1)
				: role.rate.endsWith("％")
					? role.rate.slice(0, -1)
					: role.rate;
			list += ` - ${name} --- **${role.count} / ${rate}%**\n`;
		}
		return list;
	};

	// 詳細設定の構築
	let detailedSettings = "";

	// AmongUs Tab 0
	const auTab0Categories = auMeta.tabCategoryMap[0] || [];
	for (const catId of auTab0Categories) {
		const catMeta = auMeta.categoryMetaData[catId];
		if (!catMeta) {
			continue;
		}
		// サマリーにあるものは除く
		if (catId === 0) {
			continue;
		} // Map category (approx)
		detailedSettings += `### ${catMeta.name}\n`;
		for (const optId of catMeta.options) {
			const meta = auMeta.options[optId];
			if (!meta) {
				continue;
			}
			if (
				optId === AU_MAP_OPTION_ID ||
				optId === AU_KILL_COOLDOWN_OPTION_ID ||
				optId === AU_IMPOSTOR_COUNT_OPTION_ID
			) {
				continue;
			}
			const value = getAuValue(optId);
			const formattedValue = cleanText(
				`${value}${meta.format ? meta.format.replace("{0}", "") : ""}`,
			);
			detailedSettings += `- ${cleanText(meta.title)} : ${formattedValue}\n`;
		}
	}

	// ExR General Tab
	const exrGeneralTab = exrMeta.tabs[ExRTabId.GeneralTab];
	if (exrGeneralTab) {
		const processedOptions = new Set<UniqueOptionId>();

		for (const catId of exrGeneralTab.categoryIds) {
			const category = exrMeta.categories[catId];
			if (!category) {
				continue;
			}

			let categoryContent = "";
			const addOptionAndChildren = (optId: UniqueOptionId, indent = 0) => {
				if (processedOptions.has(optId)) {
					return;
				}

				const optionDetail = exrMeta.options[optId];
				const meta = optionDetail?.metaData;
				if (!meta) {
					return;
				}

				if (!state.isExROptionActive[optId]) {
					return;
				}

				// サマリーにあるものは除く
				if (
					(MOVED_EXR_OPTION_UNIQUE_IDS as readonly number[]).includes(optId)
				) {
					return;
				}

				processedOptions.add(optId);
				const indentStr = "  ".repeat(indent);
				categoryContent += `${indentStr} - ${cleanText(
					meta.translatedName,
				)} : ${getExRFormattedValue(optId)}\n`;

				// 子オプションを再帰的に追加
				for (const childId of optionDetail.childOptionIds) {
					addOptionAndChildren(childId, indent + 1);
				}
			};

			const topLevelOptionIds =
				exrMeta.globalCategoryIdTopLevelMap[catId] || [];
			for (const optId of topLevelOptionIds) {
				addOptionAndChildren(optId);
			}

			if (categoryContent) {
				detailedSettings += `### ${cleanText(category.name)}\n${categoryContent}`;
			}
		}
	}

	let text = `# ${CLIPBOARD_SETTING_TITLE}(${presetName})\n`;
	text += `- ${mapTitle}: ${mapValue}\n`;
	text += `- ${killCooldownTitle}: ${killCooldownValue}\n`;
	text += `## ${CLIPBOARD_FACTION_COUNTS}\n`;
	text += `- ${crewRolesLabel}: ${crewRolesCount}\n`;
	text += `- ${impostorRolesLabel}: ${impostorRolesCount}\n`;
	text += `  - ${impostorCountTitle}: ${impostorCountValue}\n`;
	if (neutralRolesCount !== "0") {
		text += `- ${neutralRolesLabel}: ${neutralRolesCount}\n`;
	}
	if (liberalRolesCount !== "0") {
		text += `- ${liberalRolesLabel}: ${liberalRolesCount}\n`;
		if (militantRolesCount !== "0") {
			text += `  - ${militantRolesLabel}: ${militantRolesCount}\n`;
		}
	}

	text += `## ${CLIPBOARD_ROLES}\n`;
	if (crewRolesList.length > 0) {
		text += `### ${CLIPBOARD_CREW}\n${formatRoleList(crewRolesList)}`;
	}
	if (impostorRolesList.length > 0) {
		text += `### ${CLIPBOARD_IMPOSTOR}\n${formatRoleList(impostorRolesList)}`;
	}
	if (neutralRolesList.length > 0) {
		text += `### ${CLIPBOARD_NEUTRAL}\n${formatRoleList(neutralRolesList)}`;
	}
	if (liberalRolesList.length > 0) {
		text += `### ${CLIPBOARD_LIBERAL}\n${formatRoleList(liberalRolesList)}`;
	}

	text += `\n## ${CLIPBOARD_DETAILED_SETTINGS}\n${detailedSettings}\n`;
	text += `\n## ${CLIPBOARD_OTHERS}\n${CLIPBOARD_OTHERS_NOTE}\n`;

	return text;
}
