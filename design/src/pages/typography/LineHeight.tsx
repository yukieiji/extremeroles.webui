import { useState } from "react";
import { useDesignTheme } from "../../themeContext";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import {
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
  const { basicTextColor, neutralColors, semanticColors } = useDesignTheme();

  return (
    <div
      className={`py-0.5 ${neutralColors.neutral3.hover} transition-colors ${LINE_HEIGHT.standard}`}
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
                className={`${TYPOGRAPHY.label.size} ${LINE_HEIGHT.standard} ${TYPOGRAPHY.label.weight} ${basicTextColor.textPrimary} break-words whitespace-pre-wrap`}
              >
                {name}
              </div>
            </div>

            {/* 設定値 & フォーマット */}
            <div className="shrink-0 flex items-center gap-2">
              <div
                className={`px-2 py-1 border ${neutralColors.neutral5.border} rounded ${neutralColors.neutral2.bg} ${TYPOGRAPHY.label.size} ${TYPOGRAPHY.label.weight} ${basicTextColor.textPrimary} min-w-[3.5rem] text-center`}
              >
                {value}
              </div>
              {format && (
                <div className="flex flex-col items-start">
                  <span
                    className={`${TYPOGRAPHY.small.size} ${TYPOGRAPHY.small.weight} ${basicTextColor.textSecondary} whitespace-nowrap`}
                  >
                    {format}
                  </span>
                </div>
              )}
              <Info size={14} style={{ color: semanticColors.info }} />
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
  const { basicTextColor, neutralColors } = useDesignTheme();

  return (
    <div
      className={`border ${neutralColors.neutral4.border} rounded overflow-hidden shadow-sm`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 cursor-pointer ${neutralColors.neutral2.bg} ${neutralColors.neutral3.hover} transition-colors`}
      >
        <span
          className={`${TYPOGRAPHY.label.size} font-semibold ${basicTextColor.textPrimary}`}
        >
          {title}
        </span>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      {isOpen && (
        <div
          className={`${neutralColors.neutral1.bg} divide-y ${neutralColors.neutral4.border}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function LineHeight() {
  const { basicTextColor, neutralColors } = useDesignTheme();

  return (
    <div className={`p-6 space-y-12 ${neutralColors.neutral1.bg} min-h-screen`}>
      <section>
        <h2 className="text-2xl font-bold mb-4">行間（Line Height）の定義</h2>
        <p className={`${basicTextColor.textSecondary} mb-8`}>
          {LINE_HEIGHT.description}
        </p>
      </section>

      <section className="space-y-6">
        <div className="flex items-baseline gap-4">
          <h3 className="text-xl font-semibold">設定画面の行間テスト</h3>
          <span
            className={`${TYPOGRAPHY.small.size} ${basicTextColor.textTertiary}`}
          >
            Current: {LINE_HEIGHT.standard}
          </span>
        </div>

        <div className="space-y-4">
          <p className={basicTextColor.textSecondary}>
            OptionRowをアコーディオン内で使用した場合の表示サンプルです。
            複数行にわたる説明文や、ラベルと値のバランスを確認できます。
          </p>
          <div
            className={`p-6 border rounded ${neutralColors.neutral4.border} ${neutralColors.neutral2.bg} shadow-inner`}
          >
            <MockAccordion title="サンプル役職">
              <MockOptionRow
                name={"クルーメイト陣営\nインポスターまたは第三陣営をキルできますが、誤ってクルーメイトをキルすると自分が死亡します。"}
                value="1"
                format="x 人"
              />
              <MockOptionRow
                name={"インポスター陣営。\nインポスターの正体を知っていますが、自分はキルできません。タスクを完了させる必要があります。"}
                value="ON"
                format=""
              />
              <MockOptionRow
                name={"役職の確認が可能です。\n設定された時間ごとに生存者の役割を覗き見ることができます。"}
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
              <div className={`p-4 border rounded ${neutralColors.neutral1.bg} ${LINE_HEIGHT.standard} ${basicTextColor.textPrimary}`}>
                このテキストは、デザインシステムで定義された標準の行間（1.6）を適用しています。
                情報密度が高いアプリケーションにおいて、可読性を維持しつつ効率的に情報を配置するための設定です。
                長文の説明文でも目が疲れにくく、かつ各項目の区切りが明確になります。
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-400 uppercase">Tight (1.25)</p>
              <div className={`p-4 border rounded ${neutralColors.neutral1.bg} leading-tight ${basicTextColor.textPrimary}`}>
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
