import { useState } from "react";
import { ChevronDown, ChevronRight, Info, Plus } from "lucide-react";
import {
  BASIC_TEXT_COLOR,
  NEUTRAL_COLORS,
  DATA_FONT,
  TYPOGRAPHY,
  SEMANTIC_COLORS,
} from "../../designConstants";

/**
 * RoleCategoryAccordion のモック
 */
function RoleCategoryAccordionMock({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`border ${NEUTRAL_COLORS.neutral5.border} rounded-lg overflow-hidden ${NEUTRAL_COLORS.neutral1.bg}`}
    >
      <div
        className={`flex items-center hover:${NEUTRAL_COLORS.neutral3.bg} transition-colors`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center gap-3 p-4 text-left cursor-pointer"
        >
          {isOpen ? (
            <ChevronDown size={20} className={BASIC_TEXT_COLOR.textTertiary} />
          ) : (
            <ChevronRight size={20} className={BASIC_TEXT_COLOR.textTertiary} />
          )}
          <span className={`${TYPOGRAPHY.label.size} font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>
            {title}
          </span>
          <span className={`${DATA_FONT.family} ${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textTertiary} ml-2`}>
            ({id})
          </span>
        </button>
        <div className="px-4">
          <button className={`p-1 rounded cursor-pointer ${NEUTRAL_COLORS.neutral3.hover} transition-colors`}>
            <Plus size={20} className={BASIC_TEXT_COLOR.textSecondary} />
          </button>
        </div>
      </div>
      {isOpen && (
        <div className={`border-t ${NEUTRAL_COLORS.neutral4.border}`}>
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * ExROptionRowView / ViewerOptionRow のモック
 */
function OptionRowMock({
  label,
  value,
  format,
  depth = 0,
}: {
  label: string;
  value: string;
  format: string;
  depth?: number;
}) {
  return (
    <div
      className={`flex items-center gap-4 p-3 ${NEUTRAL_COLORS.neutral3.hover} cursor-pointer transition-colors ${NEUTRAL_COLORS.neutral1.bg}`}
      style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
    >
      <div className="flex-1 min-w-0">
        <span className={`${TYPOGRAPHY.label.size} ${TYPOGRAPHY.label.weight} ${BASIC_TEXT_COLOR.textPrimary}`}>
          {label}
        </span>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        <div className={`${DATA_FONT.family} ${TYPOGRAPHY.label.size} ${TYPOGRAPHY.label.weight} ${BASIC_TEXT_COLOR.textPrimary} px-2 py-1 border ${NEUTRAL_COLORS.neutral5.border} rounded ${NEUTRAL_COLORS.neutral2.bg} min-w-[3rem] text-center`}>
          {value}
        </div>
        <div className={`${DATA_FONT.family} ${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textSecondary}`}>
          {format}
        </div>
        <Info size={14} style={{ color: SEMANTIC_COLORS.info }} />
      </div>
    </div>
  );
}

/**
 * ChildOptionViewAccordion のモック
 */
function ChildOptionViewAccordionMock({
  label,
  value,
  format,
  depth = 0,
  children,
}: {
  label: string;
  value: string;
  format: string;
  depth?: number;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center gap-2 p-3 ${NEUTRAL_COLORS.neutral3.hover} cursor-pointer transition-colors ${NEUTRAL_COLORS.neutral1.bg}`}
        style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1 rounded cursor-pointer ${BASIC_TEXT_COLOR.textTertiary} hover:${BASIC_TEXT_COLOR.textSecondary}`}
        >
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <div className="flex-1 flex items-center justify-between gap-4">
          <span className={`${TYPOGRAPHY.label.size} ${TYPOGRAPHY.label.weight} ${BASIC_TEXT_COLOR.textPrimary}`}>
            {label}
          </span>
          <div className="shrink-0 flex items-center gap-2">
            <div className={`${DATA_FONT.family} ${TYPOGRAPHY.label.size} ${TYPOGRAPHY.label.weight} ${BASIC_TEXT_COLOR.textPrimary} px-2 py-1 border ${NEUTRAL_COLORS.neutral5.border} rounded ${NEUTRAL_COLORS.neutral2.bg} min-w-[3rem] text-center`}>
              {value}
            </div>
            <div className={`${DATA_FONT.family} ${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textSecondary}`}>
              {format}
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className={`flex flex-col border-l-2 ml-6 ${NEUTRAL_COLORS.neutral4.border}`}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function DataFont() {
  return (
    <div className={`p-6 space-y-12 ${NEUTRAL_COLORS.neutral1.bg} min-h-screen`}>
      <section>
        <h2 className="text-2xl font-bold mb-4">データ用フォント（等幅）</h2>
        <div className="space-y-4">
          <p className={`${BASIC_TEXT_COLOR.textSecondary}`}>
            {DATA_FONT.description}
          </p>
          <div className={`p-4 border rounded ${NEUTRAL_COLORS.neutral4.border} ${NEUTRAL_COLORS.neutral2.bg}`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className={`${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textTertiary} mb-1`}>Standard Font (Sans)</p>
                <p className={`${TYPOGRAPHY.label.size} ${BASIC_TEXT_COLOR.textPrimary}`}>
                  0123456789 ABCDEFGHIJKLMN
                </p>
              </div>
              <div>
                <p className={`${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textTertiary} mb-1`}>Data Font (Mono)</p>
                <p className={`${DATA_FONT.family} ${TYPOGRAPHY.label.size} ${BASIC_TEXT_COLOR.textPrimary}`}>
                  0123456789 ABCDEFGHIJKLMN
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RoleCategoryAccordion */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Role Category (RoleCategoryAccordion)</h3>
        <p className={BASIC_TEXT_COLOR.textSecondary}>
          カテゴリー名に付随する内部IDや、項目のカウント数などに等幅フォントを適用します。
        </p>
        <div className={`p-6 border rounded ${NEUTRAL_COLORS.neutral4.border} ${NEUTRAL_COLORS.neutral2.bg} shadow-inner`}>
          <RoleCategoryAccordionMock title="役職設定" id="CAT_ROLES_001">
            <div className={`divide-y ${NEUTRAL_COLORS.neutral4.border}`}>
              <OptionRowMock label="インポスター" value="2" format="人" />
              <OptionRowMock label="クルーメイト" value="8" format="人" />
            </div>
          </RoleCategoryAccordionMock>
        </div>
      </section>

      {/* OptionEditorCategoryOptionLayout & ExROptionRowView */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Option Settings (ExROptionRowView)</h3>
        <p className={BASIC_TEXT_COLOR.textSecondary}>
          設定値や単位（フォーマット）に等幅フォントを適用することで、数値の桁数に関わらずレイアウトを安定させ、視認性を高めます。
        </p>
        <div className={`p-6 border rounded ${NEUTRAL_COLORS.neutral4.border} ${NEUTRAL_COLORS.neutral2.bg} shadow-inner`}>
          <div className={`border ${NEUTRAL_COLORS.neutral5.border} rounded-lg overflow-hidden ${NEUTRAL_COLORS.neutral1.bg} divide-y ${NEUTRAL_COLORS.neutral4.border}`}>
            <OptionRowMock label="プレイヤー速度" value="1.25" format="x" />
            <OptionRowMock label="キルクールダウン" value="22.5" format="sec" />
            <OptionRowMock label="タスク勝利条件" value="100" format="%" />
            <OptionRowMock label="会議時間" value="120" format="sec" />
          </div>
        </div>
      </section>

      {/* ChildOptionViewAccordion */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Nested Options (ChildOptionViewAccordion)</h3>
        <p className={BASIC_TEXT_COLOR.textSecondary}>
          階層構造を持つオプションにおいても、右側に並ぶ数値とフォーマットに等幅フォントを一貫して適用します。
        </p>
        <div className={`p-6 border rounded ${NEUTRAL_COLORS.neutral4.border} ${NEUTRAL_COLORS.neutral2.bg} shadow-inner`}>
          <div className={`border ${NEUTRAL_COLORS.neutral5.border} rounded-lg overflow-hidden ${NEUTRAL_COLORS.neutral1.bg} divide-y ${NEUTRAL_COLORS.neutral4.border}`}>
            <ChildOptionViewAccordionMock label="マッドメイト設定" value="ON" format="">
              <div className={`divide-y ${NEUTRAL_COLORS.neutral4.border}`}>
                <OptionRowMock label="出現確率" value="50" format="%" depth={1} />
                <OptionRowMock label="キル可能数" value="0" format="回" depth={1} />
              </div>
            </ChildOptionViewAccordionMock>
            <OptionRowMock label="シェイプシフター出現" value="1" format="人" />
          </div>
        </div>
      </section>
    </div>
  );
}
