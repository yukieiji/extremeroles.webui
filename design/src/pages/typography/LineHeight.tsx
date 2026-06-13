import { useState } from "react";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import {
  BASIC_TEXT_COLOR,
  NEUTRAL_COLORS,
  SEMANTIC_COLORS,
  TYPOGRAPHY,
  LINE_HEIGHT,
} from "../../designConstants";

/**
 * OptionRowのモック
 * src/components/parts/OptionRowContainer.tsx と OptionItem.tsx の構造を模倣
 */
function MockOptionRow({
  name,
  value,
  format,
}: {
  name: string;
  value: string;
  format: string;
}) {
  return (
    <div
      className={`py-0.5 hover:bg-gray-800/10 transition-colors ${LINE_HEIGHT.standard}`}
    >
      <div className="flex items-stretch px-4">
        {/* 左側領域（スペーサー） */}
        <div className="flex items-center justify-center w-10 shrink-0" />

        {/* 右側領域 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3">
            {/* 設定名 */}
            <div className="flex-1 min-w-0">
              <div
                className={`${TYPOGRAPHY.label.size} ${TYPOGRAPHY.label.weight} ${BASIC_TEXT_COLOR.textPrimary} break-words`}
              >
                {name}
              </div>
            </div>

            {/* 設定値 & フォーマット */}
            <div className="shrink-0 flex items-center gap-2">
              <div
                className={`px-2 py-1 border ${NEUTRAL_COLORS.neutral5.border} rounded ${NEUTRAL_COLORS.neutral2.bg} ${TYPOGRAPHY.label.size} ${TYPOGRAPHY.label.weight} ${BASIC_TEXT_COLOR.textPrimary} min-w-[3.5rem] text-center`}
              >
                {value}
              </div>
              {format && (
                <div className="flex flex-col items-start">
                  <span
                    className={`${TYPOGRAPHY.small.size} ${TYPOGRAPHY.small.weight} ${BASIC_TEXT_COLOR.textSecondary} whitespace-nowrap`}
                  >
                    {format}
                  </span>
                </div>
              )}
              <Info size={14} style={{ color: SEMANTIC_COLORS.info }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * アコーディオンのモック
 * src/components/blocks/OptionEditorAccordion.tsx 等の構造を模倣
 */
function MockAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`border ${NEUTRAL_COLORS.neutral4.border} rounded overflow-hidden shadow-sm`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 cursor-pointer ${NEUTRAL_COLORS.neutral2.bg} ${NEUTRAL_COLORS.neutral3.hover} transition-colors`}
      >
        <span
          className={`${TYPOGRAPHY.label.size} font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}
        >
          {title}
        </span>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      {isOpen && (
        <div
          className={`${NEUTRAL_COLORS.neutral1.bg} divide-y ${NEUTRAL_COLORS.neutral4.border}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function LineHeight() {
  return (
    <div className={`p-6 space-y-12 ${NEUTRAL_COLORS.neutral1.bg} min-h-screen`}>
      <section>
        <h2 className="text-2xl font-bold mb-4">行間（Line Height）の定義</h2>
        <p className={`${BASIC_TEXT_COLOR.textSecondary} mb-8`}>
          {LINE_HEIGHT.description}
        </p>
      </section>

      <section className="space-y-6">
        <div className="flex items-baseline gap-4">
          <h3 className="text-xl font-semibold">設定画面の行間テスト</h3>
          <span
            className={`${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textTertiary}`}
          >
            Current: {LINE_HEIGHT.standard}
          </span>
        </div>

        <div className="space-y-4">
          <p className={BASIC_TEXT_COLOR.textSecondary}>
            OptionRowをアコーディオン内で使用した場合の表示サンプルです。
            複数行にわたる説明文や、ラベルと値のバランスを確認できます。
          </p>
          <div
            className={`p-6 border rounded ${NEUTRAL_COLORS.neutral4.border} ${NEUTRAL_COLORS.neutral2.bg} shadow-inner`}
          >
            <MockAccordion title="役職設定 (Role Settings)">
              <MockOptionRow
                name="シェリフ (Sheriff): クルーメイト陣営。インポスターまたは第三陣営をキルできますが、誤ってクルーメイトをキルすると自分が死亡します。"
                value="1"
                format="x 人"
              />
              <MockOptionRow
                name="マッドメイト (Madmate): インポスター陣営。インポスターの正体を知っていますが、自分はキルできません。タスクを完了させる必要があります。"
                value="ON"
                format=""
              />
              <MockOptionRow
                name="シーア (Seer): 役職の確認が可能です。設定された時間ごとに生存者の役割を覗き見ることができます。"
                value="2"
                format="x 人"
              />
            </MockAccordion>
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <h4 className="text-lg font-medium">テキストのみの比較</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-400 uppercase">Standard (1.6)</p>
              <div className={`p-4 border rounded ${NEUTRAL_COLORS.neutral1.bg} ${LINE_HEIGHT.standard} ${BASIC_TEXT_COLOR.textPrimary}`}>
                このテキストは、デザインシステムで定義された標準の行間（1.6）を適用しています。
                情報密度が高いアプリケーションにおいて、可読性を維持しつつ効率的に情報を配置するための設定です。
                長文の説明文でも目が疲れにくく、かつ各項目の区切りが明確になります。
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-400 uppercase">Tight (1.25)</p>
              <div className={`p-4 border rounded ${NEUTRAL_COLORS.neutral1.bg} leading-tight ${BASIC_TEXT_COLOR.textPrimary}`}>
                このテキストは、比較用の詰まった行間（1.25）を適用しています。
                情報密度は非常に高くなりますが、複数行にわたる場合に文字が重なって見えたり、
                行を追うのが難しくなる可能性があります。特に日本語フォントでは窮屈に感じられやすいです。
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
