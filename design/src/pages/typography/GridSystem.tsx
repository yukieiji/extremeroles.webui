import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Info,
  Menu,
  Settings,
  ChevronLeft,
  Dot,
} from "lucide-react";
import {
  BASIC_TEXT_COLOR,
  NEUTRAL_COLORS,
  GRID_SYSTEM,
  TYPOGRAPHY,
  SEMANTIC_COLORS,
  PRIMARY_ACTION_COLOR,
} from "../../designConstants";

/**
 * 視覚補助用のオーバーレイ
 */
function VisualAidOverlay({
  spacingValue,
  type = "padding",
  label,
}: {
  spacingValue?: string;
  type?: "padding" | "gap" | "layout";
  label?: string;
}) {
  if (type === "gap" || type === "layout") {
    const isVertical = type === "layout";
    return (
      <div
        className="bg-blue-400/20 border border-blue-400/30 pointer-events-none flex items-center justify-center z-20"
        style={{
          height: isVertical ? "100%" : spacingValue,
          width: isVertical ? spacingValue : "100%",
          position: "relative",
        }}
      >
        <span
          className={`text-[8px] text-blue-600 font-mono ${
            isVertical ? "rotate-90" : ""
          }`}
        >
          {label || spacingValue}
        </span>
      </div>
    );
  }
  return (
    <div
      className="absolute inset-0 border-blue-400/10 pointer-events-none z-20"
      style={{
        borderWidth: spacingValue,
        borderColor: "rgba(96, 165, 250, 0.2)",
      }}
    />
  );
}

/**
 * Sidebar モック
 * src/feature/OptionGroupToggleSidebar.tsx に対応
 */
function SidebarMock({
  isOpen,
  setIsOpen,
  showVisualAid,
}: {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  showVisualAid: boolean;
}) {
  const [activeTab, setActiveTab] = useState("Au");
  const tabs = [
    { id: "Au", label: "Among Us Options", shortLabel: "Au" },
    { id: "ExR", label: "Extreme Roles Options", shortLabel: "ExR" },
    { id: "RoleFilter", label: "Role Filter", shortLabel: "Role" },
  ];

  return (
    <div
      className={`flex flex-col border-r ${NEUTRAL_COLORS.neutral4.border} ${
        NEUTRAL_COLORS.neutral2.bg
      } transition-all duration-300 ${isOpen ? "w-56" : "w-14"}`}
    >
      <div className={`flex flex-row items-center justify-end ${GRID_SYSTEM.spacing.s.padding}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1 rounded cursor-pointer ${NEUTRAL_COLORS.neutral3.hover} transition-colors ${BASIC_TEXT_COLOR.textSecondary}`}
        >
          {isOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className={`flex flex-col gap-1 ${GRID_SYSTEM.spacing.s.padding.replace('p-', 'px-')}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center cursor-pointer transition-colors rounded ${
                NEUTRAL_COLORS.neutral3.hover
              } ${activeTab === tab.id ? NEUTRAL_COLORS.neutral4.bg : ""} ${
                isOpen ? "px-3 py-2" : "h-10 justify-center"
              }`}
            >
              {isOpen ? (
                <span
                  className={`${TYPOGRAPHY.sidebar.size} ${TYPOGRAPHY.sidebar.weight} ${BASIC_TEXT_COLOR.textPrimary} truncate`}
                >
                  {tab.label}
                </span>
              ) : (
                <span
                  className={`${TYPOGRAPHY.sidebar.size} font-bold ${BASIC_TEXT_COLOR.textPrimary}`}
                >
                  {tab.shortLabel}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className={`${GRID_SYSTEM.spacing.s.padding} border-t ${NEUTRAL_COLORS.neutral4.border}`}>
        <button
          className={`w-full flex items-center gap-3 cursor-pointer transition-colors rounded ${
            NEUTRAL_COLORS.neutral3.hover
          } ${isOpen ? "px-3 py-2" : "h-10 justify-center"}`}
        >
          <Settings size={20} className={`shrink-0 ${BASIC_TEXT_COLOR.textSecondary}`} />
          {isOpen && (
            <span
              className={`${TYPOGRAPHY.sidebar.size} ${TYPOGRAPHY.sidebar.weight} ${BASIC_TEXT_COLOR.textPrimary}`}
            >
              Settings
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * EditorContainer モック
 * src/components/blocks/EditorContainer.tsx に対応
 */
function EditorContainerMock({
  showVisualAid,
  children,
}: {
  showVisualAid: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col flex-1 overflow-hidden h-full ${GRID_SYSTEM.spacing.s.gap}`}>
      {/* Selector Area (Tabs) */}
      <div className={`border-b ${NEUTRAL_COLORS.neutral4.border} ${NEUTRAL_COLORS.neutral2.bg}`}>
        <div className="flex">
          {["General", "Roles", "System"].map((tab, i) => (
            <div
              key={tab}
              className={`px-4 py-2 ${TYPOGRAPHY.tab.size} ${
                i === 0
                  ? `${BASIC_TEXT_COLOR.textPrimary} border-b-2 border-blue-500`
                  : BASIC_TEXT_COLOR.textSecondary
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto relative">
         {children}
      </div>
    </div>
  );
}

/**
 * RoleCategoryAccordion モック
 * src/components/blocks/RoleCategoryAccordion.tsx に対応
 */
function RoleCategoryAccordionMock({
  text,
  isOpen: initialOpen = true,
  showVisualAid,
  children,
}: {
  text: string;
  isOpen?: boolean;
  showVisualAid: boolean;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const spacing = GRID_SYSTEM.spacing.m;

  return (
    <div className={`border ${NEUTRAL_COLORS.neutral4.border} rounded-lg overflow-hidden ${NEUTRAL_COLORS.neutral1.bg}`}>
      <div className={`flex items-center ${NEUTRAL_COLORS.neutral3.hover} transition-colors relative`}>
        {showVisualAid && <VisualAidOverlay spacingValue={spacing.value} />}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex-1 flex items-center gap-3 ${spacing.padding} text-left cursor-pointer`}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {isOpen ? <ChevronDown size={20} className={BASIC_TEXT_COLOR.textTertiary} /> : <ChevronRight size={20} className={BASIC_TEXT_COLOR.textTertiary} />}
          </div>
          <span className={`${TYPOGRAPHY.label.size} font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>
            {text}
          </span>
        </button>
        <div className={`${spacing.padding.replace('p-', 'px-')} flex items-center`}>
           <div className={`w-8 h-8 rounded-full border ${NEUTRAL_COLORS.neutral4.border} flex items-center justify-center ${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textSecondary}`}>
             0
           </div>
        </div>
      </div>
      {isOpen && (
        <div className={`border-t ${NEUTRAL_COLORS.neutral4.border} flex flex-col`}>
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * OptionRow モック
 * src/components/parts/OptionRowContainer.tsx に対応
 */
function OptionRowMock({
  label,
  value,
  depth = 0,
  showVisualAid,
}: {
  label: string;
  value: string;
  depth?: number;
  showVisualAid: boolean;
}) {
  // calculateIndentation(depth, indentMultiplier, 0.375)
  // depth 1, multiplier 0.5 => 1 * 0.5 + 0.375 = 0.875rem
  const paddingLeft = `${depth * 0.5 + 0.375}rem`;

  return (
    <div className={`py-0.5 ${NEUTRAL_COLORS.neutral3.hover} transition-colors group relative`}>
      <div className="flex items-stretch" style={{ paddingLeft }}>
        {/* Leading area (10 units = 2.5rem) */}
        <div className="flex items-center justify-center w-10 shrink-0">
           <div className="w-4 h-4 rounded border border-gray-400" />
        </div>
        {/* Content area */}
        <div className="flex-1 min-w-0 flex items-center justify-between pr-4 h-10">
           <span className={`${TYPOGRAPHY.label.size} ${BASIC_TEXT_COLOR.textPrimary}`}>
             {label}
           </span>
           <div className="flex items-center gap-2">
             <div className={`px-2 py-0.5 border ${NEUTRAL_COLORS.neutral5.border} rounded ${NEUTRAL_COLORS.neutral2.bg} ${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textPrimary}`}>
                {value}
             </div>
             <Info size={14} className={BASIC_TEXT_COLOR.textTertiary} />
           </div>
        </div>
      </div>
      {showVisualAid && (
        <div className="absolute top-0 bottom-0 left-0 bg-blue-400/10 pointer-events-none" style={{ width: paddingLeft }} />
      )}
    </div>
  );
}

/**
 * ChildOptionViewAccordion モック
 * src/components/blocks/ChildOptionViewAccordion.tsx に対応
 */
function ChildOptionViewAccordionMock({
  label,
  value,
  depth = 0,
  showVisualAid,
  children,
}: {
  label: string;
  value: string;
  depth?: number;
  showVisualAid: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const paddingLeft = `${depth * 0.5 + 0.375}rem`;

  return (
    <div className="flex flex-col">
      <div className={`py-0.5 ${NEUTRAL_COLORS.neutral3.hover} transition-colors relative`}>
        <div className="flex items-stretch" style={{ paddingLeft }}>
          <div className="flex items-center justify-center w-10 shrink-0">
             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-300">
               {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
             </button>
          </div>
          <div className="flex-1 min-w-0 flex items-center justify-between pr-4 h-10">
             <span className={`${TYPOGRAPHY.label.size} ${BASIC_TEXT_COLOR.textPrimary}`}>
               {label}
             </span>
             <div className={`px-2 py-0.5 border ${NEUTRAL_COLORS.neutral5.border} rounded ${NEUTRAL_COLORS.neutral2.bg} ${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textPrimary}`}>
                {value}
             </div>
          </div>
        </div>
        {showVisualAid && (
          <div className="absolute top-0 bottom-0 left-0 bg-blue-400/10 pointer-events-none" style={{ width: paddingLeft }} />
        )}
      </div>
      {isOpen && (
        <div className="flex flex-col bg-black/5">
          {children}
        </div>
      )}
    </div>
  );
}

export default function GridSystem() {
  const [showVisualAid, setShowVisualAid] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={`p-6 space-y-12 ${NEUTRAL_COLORS.neutral1.bg} min-h-screen pb-24`}>
      <section>
        <div className="flex justify-between items-start">
          <div>
            <h2 className={`text-2xl font-bold mb-4 ${BASIC_TEXT_COLOR.textPrimary}`}>グリッドシステム</h2>
            <p className={`${BASIC_TEXT_COLOR.textSecondary} max-w-2xl`}>
              余白を8の倍数で固定し、ルールに基づいて項目間の距離を制御します。
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

      {/* アプリ全体の構成例 */}
      <section className="space-y-6">
        <h3 className={`text-xl font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>全体レイアウト構造 (Layout Structure)</h3>
        <p className={BASIC_TEXT_COLOR.textSecondary}>
          サイドバー、タブ（Selector）、メインコンテンツの配置とそれらの間の余白を確認できます。
        </p>
        <div className={`h-96 border ${NEUTRAL_COLORS.neutral4.border} rounded-xl overflow-hidden flex bg-white relative shadow-lg`}>
          <SidebarMock isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} showVisualAid={showVisualAid} />

          {showVisualAid && isSidebarOpen && (
             <div className="absolute left-56 top-0 bottom-0 w-0 z-30">
               <div className="absolute left-0 top-1/2 -translate-y-1/2">
                 <VisualAidOverlay type="layout" spacingValue="1px" label="Border" />
               </div>
             </div>
          )}

          <EditorContainerMock showVisualAid={showVisualAid}>
             <div className={`${GRID_SYSTEM.spacing.m.padding} ${GRID_SYSTEM.spacing.m.gap} flex flex-col`}>
                <RoleCategoryAccordionMock text="役職設定" showVisualAid={showVisualAid}>
                   <OptionRowMock label="インポスターの数" value="2" showVisualAid={showVisualAid} />
                   <ChildOptionViewAccordionMock label="マッドメイト設定" value="ON" depth={1} showVisualAid={showVisualAid}>
                      <OptionRowMock label="出現確率" value="50%" depth={2} showVisualAid={showVisualAid} />
                   </ChildOptionViewAccordionMock>
                   <OptionRowMock label="クルーメイトの数" value="8" showVisualAid={showVisualAid} />
                </RoleCategoryAccordionMock>

                <div className={`${GRID_SYSTEM.spacing.m.padding} border ${NEUTRAL_COLORS.neutral4.border} rounded-lg ${NEUTRAL_COLORS.neutral2.bg} flex justify-end gap-2`}>
                   <button className={`px-4 py-2 rounded text-sm font-medium ${NEUTRAL_COLORS.neutral1.bg} border ${NEUTRAL_COLORS.neutral5.border} ${BASIC_TEXT_COLOR.textSecondary}`}>
                     キャンセル
                   </button>
                   <button className={`px-4 py-2 rounded text-sm font-medium ${PRIMARY_ACTION_COLOR.primary} text-white ${PRIMARY_ACTION_COLOR.hover} shadow-sm`}>
                     設定を保存
                   </button>
                </div>
             </div>
          </EditorContainerMock>
        </div>
      </section>

      {/* 余白のテスト・調整ガイド */}
      <section className={`grid grid-cols-1 md:grid-cols-2 gap-12`}>
        <div className={`space-y-6`}>
          <h3 className={`text-xl font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>アコーディオン・イン・アコーディオン</h3>
          <p className={BASIC_TEXT_COLOR.textSecondary}>
            階層が深くなる場合のインデントと余白のバランスを確認します。
          </p>
          <div className={`border ${NEUTRAL_COLORS.neutral4.border} rounded-lg overflow-hidden ${NEUTRAL_COLORS.neutral1.bg} divide-y ${NEUTRAL_COLORS.neutral4.border}`}>
             <OptionRowMock label="ルート項目" value="Value" showVisualAid={showVisualAid} />
             <ChildOptionViewAccordionMock label="第一階層アコーディオン" value="Expand" depth={1} showVisualAid={showVisualAid}>
                <OptionRowMock label="第二階層項目" value="Value" depth={2} showVisualAid={showVisualAid} />
                <ChildOptionViewAccordionMock label="第二階層アコーディオン" value="Expand" depth={2} showVisualAid={showVisualAid}>
                   <OptionRowMock label="第三階層項目" value="Value" depth={3} showVisualAid={showVisualAid} />
                </ChildOptionViewAccordionMock>
             </ChildOptionViewAccordionMock>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className={`text-xl font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>設計・調整のヒント</h3>
          <div className={`p-6 border-l-4 border-blue-500 bg-blue-50 ${TYPOGRAPHY.label.size}`}>
            <h4 className="font-bold text-blue-800 mb-2">実装時の注意点</h4>
            <ul className="list-disc list-inside space-y-2 text-blue-700">
              <li><strong>定数の利用:</strong> <code>designConstants.ts</code> の <code>GRID_SYSTEM</code> に定義された値を使用することを推奨します。</li>
              <li><strong>色の指定:</strong> テキストには <code>BASIC_TEXT_COLOR</code>、背景や枠線には <code>NEUTRAL_COLORS</code> を使用し、一貫性を保ちます。</li>
              <li><strong>インタラクション:</strong> 主要なボタンには <code>PRIMARY_ACTION_COLOR</code> を適用し、視認性を高めます。</li>
              <li><strong>階層の表現:</strong> インデントには <code>depth</code> に基づく計算ロジックを一貫して適用し、情報の階層を視覚化します。</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
