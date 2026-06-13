import { useState } from "react";
import { ChevronDown, ChevronRight, Info, Menu, Settings } from "lucide-react";
import {
  BASIC_TEXT_COLOR,
  NEUTRAL_COLORS,
  GRID_SYSTEM,
  TYPOGRAPHY,
  SEMANTIC_COLORS,
} from "../../designConstants";

/**
 * スペーシングを視覚化するためのコンポーネント
 */
function SpacingVisualizer({
  label,
  orientation = "horizontal",
}: {
  label: string;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="bg-blue-400/30 border border-blue-500/50 flex items-center justify-center relative group"
        style={{
          width: orientation === "horizontal" ? label : "2rem",
          height: orientation === "vertical" ? label : "2rem",
        }}
      >
        <span className="absolute -top-6 text-[10px] font-mono text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {label}
        </span>
      </div>
      <span className={`${TYPOGRAPHY.small.size} text-blue-600 font-mono`}>{label}</span>
    </div>
  );
}

/**
 * 視覚補助用のオーバーレイ
 */
function VisualAidOverlay({ spacingValue, type = "padding" }: { spacingValue: string, type?: "padding" | "gap" }) {
  if (type === "gap") {
    return (
      <div
        className="bg-blue-400/20 border border-blue-400/30 pointer-events-none flex items-center justify-center"
        style={{ height: spacingValue, width: "100%" }}
      >
        <span className="text-[8px] text-blue-600 font-mono">{spacingValue}</span>
      </div>
    );
  }
  return (
    <div
      className="absolute inset-0 border-blue-400/10 pointer-events-none"
      style={{ borderWidth: spacingValue, borderColor: "rgba(96, 165, 250, 0.2)" }}
    />
  );
}

/**
 * サイドバー & メインレイアウトのモック
 */
function SidebarLayoutMock({ showVisualAid }: { showVisualAid: boolean }) {
  const layoutGap = GRID_SYSTEM.spacing.l; // 24px
  const sidebarWidth = "w-48";

  return (
    <div className={`flex ${layoutGap.gap} h-64 border ${NEUTRAL_COLORS.neutral4.border} ${NEUTRAL_COLORS.neutral2.bg} p-2 relative`}>
      {/* Sidebar */}
      <div className={`${sidebarWidth} ${NEUTRAL_COLORS.neutral1.bg} border ${NEUTRAL_COLORS.neutral4.border} rounded flex flex-col`}>
        <div className="p-3 border-b border-neutral-200">
           <div className="w-8 h-8 bg-neutral-200 rounded" />
        </div>
        <div className="flex-1 p-2 space-y-2">
           {[1, 2, 3].map(i => <div key={i} className="h-4 bg-neutral-100 rounded w-full" />)}
        </div>
      </div>

      {/* Gap Visual Aid */}
      {showVisualAid && (
        <div className="absolute top-0 bottom-0 bg-blue-400/20 flex items-center justify-center"
             style={{ left: "12.5rem", width: layoutGap.value }}>
          <span className="text-[10px] text-blue-600 font-mono rotate-90">{layoutGap.value}</span>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${NEUTRAL_COLORS.neutral1.bg} border ${NEUTRAL_COLORS.neutral4.border} rounded p-4 space-y-4`}>
         <div className="h-6 bg-neutral-200 rounded w-1/3" />
         <div className="space-y-2">
           <div className="h-4 bg-neutral-100 rounded w-full" />
           <div className="h-4 bg-neutral-100 rounded w-full" />
           <div className="h-4 bg-neutral-100 rounded w-3/4" />
         </div>
      </div>
    </div>
  );
}

/**
 * アコーディオン & OptionRow のモック
 */
function AccordionMock({
  title,
  spacingKey,
  showVisualAid,
  children
}: {
  title: string,
  spacingKey: keyof typeof GRID_SYSTEM.spacing,
  showVisualAid: boolean,
  children: React.ReactNode
}) {
  const spacing = GRID_SYSTEM.spacing[spacingKey];
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`border ${NEUTRAL_COLORS.neutral5.border} rounded-lg overflow-hidden ${NEUTRAL_COLORS.neutral1.bg}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between ${spacing.padding} ${NEUTRAL_COLORS.neutral3.hover} transition-colors relative`}
      >
        {showVisualAid && <VisualAidOverlay spacingValue={spacing.value} />}
        <span className={`${TYPOGRAPHY.label.size} ${TYPOGRAPHY.label.weight} ${BASIC_TEXT_COLOR.textPrimary}`}>
          {title}
        </span>
        {isOpen ? <ChevronDown size={18} className={BASIC_TEXT_COLOR.textTertiary} /> : <ChevronRight size={18} className={BASIC_TEXT_COLOR.textTertiary} />}
      </button>
      {isOpen && (
        <div className={`border-t ${NEUTRAL_COLORS.neutral4.border} ${NEUTRAL_COLORS.neutral2.bg}`}>
          {children}
        </div>
      )}
    </div>
  );
}

function OptionRowMock({
  label,
  value,
  spacingKey,
  showVisualAid
}: {
  label: string,
  value: string,
  spacingKey: keyof typeof GRID_SYSTEM.spacing,
  showVisualAid: boolean
}) {
  const spacing = GRID_SYSTEM.spacing[spacingKey];
  return (
    <div className={`flex items-center ${spacing.gap} ${spacing.padding} border-b ${NEUTRAL_COLORS.neutral4.border} last:border-0 ${NEUTRAL_COLORS.neutral1.bg} relative`}>
      {showVisualAid && <VisualAidOverlay spacingValue={spacing.value} />}
      <div className="flex-1">
        <span className={`${TYPOGRAPHY.label.size} ${TYPOGRAPHY.label.weight} ${BASIC_TEXT_COLOR.textPrimary}`}>
          {label}
        </span>
      </div>
      <div className={`px-2 py-1 border ${NEUTRAL_COLORS.neutral5.border} rounded ${NEUTRAL_COLORS.neutral2.bg} ${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textPrimary}`}>
        {value}
      </div>
      <Info size={14} style={{ color: SEMANTIC_COLORS.info }} />
    </div>
  );
}

/**
 * カードのモック
 */
function CardMock({ spacingKey, showVisualAid }: { spacingKey: keyof typeof GRID_SYSTEM.spacing, showVisualAid: boolean }) {
  const spacing = GRID_SYSTEM.spacing[spacingKey];
  return (
    <div className={`border ${NEUTRAL_COLORS.neutral5.border} rounded-xl ${NEUTRAL_COLORS.neutral1.bg} shadow-sm overflow-hidden`}>
      <div className={`${spacing.padding} border-b ${NEUTRAL_COLORS.neutral4.border} bg-neutral-50 relative`}>
        {showVisualAid && <VisualAidOverlay spacingValue={spacing.value} />}
        <h4 className={`${TYPOGRAPHY.tab.size} ${TYPOGRAPHY.tab.weight} ${BASIC_TEXT_COLOR.textPrimary}`}>
          カードタイトル
        </h4>
      </div>
      <div className={`${spacing.padding} ${spacing.gap} flex flex-col relative`}>
        {showVisualAid && <VisualAidOverlay spacingValue={spacing.value} />}
        <p className={`${TYPOGRAPHY.label.size} ${BASIC_TEXT_COLOR.textSecondary}`}>
          カードのコンテンツエリアです。
        </p>
        <div className={`flex ${spacing.gap} items-center relative`}>
          {/* Note: In a real implementation, we might use a separate container for buttons to avoid visual aid overlap if desired */}
          <div className="h-8 px-4 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-medium">保存</div>
          <div className={`h-8 px-4 border ${NEUTRAL_COLORS.neutral5.border} rounded flex items-center justify-center ${BASIC_TEXT_COLOR.textSecondary} text-sm`}>キャンセル</div>
        </div>
      </div>
    </div>
  );
}

export default function GridSystem() {
  const [showVisualAid, setShowVisualAid] = useState(true);

  return (
    <div className={`p-6 space-y-12 ${NEUTRAL_COLORS.neutral1.bg} min-h-screen pb-24`}>
      <section>
        <div className="flex justify-between items-start">
          <div>
            <h2 className={`text-2xl font-bold mb-4 ${BASIC_TEXT_COLOR.textPrimary}`}>グリッドシステム</h2>
            <p className={`${BASIC_TEXT_COLOR.textSecondary} max-w-2xl`}>
              {GRID_SYSTEM.description}
            </p>
          </div>
          <button
            onClick={() => setShowVisualAid(!showVisualAid)}
            className={`px-4 py-2 rounded border transition-colors ${
              showVisualAid
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : `${NEUTRAL_COLORS.neutral1.bg} border-neutral-300 text-neutral-600 hover:bg-neutral-50`
            }`}
          >
            視覚補助: {showVisualAid ? "ON" : "OFF"}
          </button>
        </div>
      </section>

      {/* スペーシング定義 */}
      <section className="space-y-6">
        <h3 className={`text-xl font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>スペーシング定義</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(Object.entries(GRID_SYSTEM.spacing) as [keyof typeof GRID_SYSTEM.spacing, any][]).map(([key, config]) => (
            <div key={key} className={`p-4 border ${NEUTRAL_COLORS.neutral4.border} rounded-lg ${NEUTRAL_COLORS.neutral1.bg} shadow-sm space-y-4`}>
              <div className="flex justify-between items-center">
                <span className={`font-bold text-lg uppercase ${BASIC_TEXT_COLOR.textPrimary}`}>{key}</span>
                <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-sm">{config.value}</span>
              </div>
              <p className={`${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textSecondary} min-h-[3rem]`}>
                {config.description}
              </p>
              <div className="flex items-end h-12">
                <SpacingVisualizer label={config.value} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* レイアウト構成 */}
      <section className="space-y-6">
        <h3 className={`text-xl font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>全体レイアウト (Layout Spacing)</h3>
        <p className={BASIC_TEXT_COLOR.textSecondary}>
          サイドバーとメインコンテンツ、または大きなセクション間の余白には <strong>L (24px)</strong> または <strong>XL (32px)</strong> を使用します。
        </p>
        <SidebarLayoutMock showVisualAid={showVisualAid} />
      </section>

      {/* アコーディオンと項目の余白 */}
      <section className="space-y-6">
        <h3 className={`text-xl font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>アコーディオンと項目の余白 (Gap & Internal Spacing)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className={`${TYPOGRAPHY.small.size} font-bold text-neutral-400 uppercase`}>Example: Accordion List (Gap M: 16px)</h4>
            <div className={`flex flex-col ${GRID_SYSTEM.spacing.m.gap} relative`}>
              {showVisualAid && (
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-10">
                   <VisualAidOverlay spacingValue={GRID_SYSTEM.spacing.m.value} type="gap" />
                </div>
              )}
              <AccordionMock title="一般設定" spacingKey="m" showVisualAid={showVisualAid}>
                <div className="divide-y divide-neutral-200">
                  <OptionRowMock label="プレイヤーの速度" value="1.0x" spacingKey="s" showVisualAid={showVisualAid} />
                  <OptionRowMock label="キルクールダウン" value="45s" spacingKey="s" showVisualAid={showVisualAid} />
                </div>
              </AccordionMock>
              <AccordionMock title="役職設定" spacingKey="m" showVisualAid={showVisualAid}>
                <div className="p-4 text-center text-neutral-400 italic text-sm">役職項目がここに並びます</div>
              </AccordionMock>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className={`${TYPOGRAPHY.small.size} font-bold text-neutral-400 uppercase`}>Example: Detail Row (Gap S: 8px)</h4>
            <div className={`p-4 border ${NEUTRAL_COLORS.neutral4.border} rounded-lg ${NEUTRAL_COLORS.neutral1.bg}`}>
               <p className={`${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textTertiary} mb-2`}>密接な関係にある項目の並び</p>
               <div className={`flex flex-col ${GRID_SYSTEM.spacing.s.gap} relative`}>
                  {showVisualAid && (
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-10 pointer-events-none">
                      <VisualAidOverlay spacingValue={GRID_SYSTEM.spacing.s.value} type="gap" />
                    </div>
                  )}
                  <div className={`p-2 border ${NEUTRAL_COLORS.neutral4.border} rounded flex justify-between items-center`}>
                     <span className={BASIC_TEXT_COLOR.textPrimary}>項目 A</span>
                     <div className="w-12 h-4 bg-neutral-200 rounded" />
                  </div>
                  <div className={`p-2 border ${NEUTRAL_COLORS.neutral4.border} rounded flex justify-between items-center`}>
                     <span className={BASIC_TEXT_COLOR.textPrimary}>項目 B</span>
                     <div className="w-12 h-4 bg-neutral-200 rounded" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* カードでの使用例 */}
      <section className="space-y-6">
        <h3 className={`text-xl font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>カード内の余白 (Padding & Gap)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className={`${TYPOGRAPHY.small.size} font-bold text-neutral-400 uppercase`}>Example: Spacing M (16px)</h4>
            <CardMock spacingKey="m" showVisualAid={showVisualAid} />
          </div>
          <div className="space-y-4">
            <h4 className={`${TYPOGRAPHY.small.size} font-bold text-neutral-400 uppercase`}>Example: Spacing L (24px)</h4>
            <CardMock spacingKey="l" showVisualAid={showVisualAid} />
          </div>
        </div>
      </section>

      {/* 調整のためのガイドライン */}
      <section className={`p-6 border-l-4 border-blue-500 bg-blue-50 ${TYPOGRAPHY.label.size}`}>
        <h4 className="font-bold text-blue-800 mb-2">設計・調整のルール</h4>
        <ul className="list-disc list-inside space-y-2 text-blue-700">
          <li><strong>一貫性:</strong> <code>designConstants.ts</code> の <code>GRID_SYSTEM</code> を使用し、直接数値を指定（例：<code>p-[13px]</code>）しないようにします。</li>
          <li><strong>階層構造:</strong> 全体レイアウトには <strong>L/XL</strong>、コンポーネントのパディングには <strong>M</strong>、内部の小要素間には <strong>S</strong> を適用するのが基本です。</li>
          <li><strong>視認性:</strong> 情報密度が高い場合は <strong>S (8px)</strong> を多用し、情報の区切りを明確にしたい場合は <strong>M (16px)</strong> 以上の余白を設けます。</li>
        </ul>
      </section>
    </div>
  );
}
