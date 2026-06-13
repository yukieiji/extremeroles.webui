import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Info,
  Menu,
  Settings,
  ChevronLeft,
  Search,
  Upload,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  BASIC_TEXT_COLOR,
  NEUTRAL_COLORS,
  GRID_SYSTEM,
  TYPOGRAPHY,
  PRIMARY_ACTION_COLOR,
  DATA_FONT,
} from "../../designConstants";

/**
 * 視覚補助用のオーバーレイ
 */
function VisualAidOverlay({
  level,
  type = "padding",
  label,
}: {
  level: keyof typeof GRID_SYSTEM.spacing;
  type?: "padding" | "gap" | "layout";
  label?: string;
}) {
  const spacing = GRID_SYSTEM.spacing[level];
  const spacingValue = spacing.value;

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
      className="absolute inset-0 border-blue-400/20 pointer-events-none z-20"
      style={{
        borderWidth: spacingValue,
        borderColor: "rgba(96, 165, 250, 0.2)",
      }}
    >
        <div className="absolute inset-0 flex items-center justify-center">
             <span className={`text-[10px] text-blue-600 font-bold bg-white/80 ${GRID_SYSTEM.spacing.xs.paddingX} rounded shadow-sm`}>
                {label || `${level.toUpperCase()} (${spacingValue})`}
             </span>
        </div>
    </div>
  );
}

/**
 * Sidebar モック
 */
function SidebarMock({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("ExR");
  const tabs = [
    { id: "Au", label: "Among Us Options", shortLabel: "Au" },
    { id: "ExR", label: "Extreme Roles Options", shortLabel: "ExR" },
    { id: "RoleFilter", label: "Role Filter", shortLabel: "Role" },
  ];

  return (
    <div
      className={`${isOpen ? "w-56" : "w-14"} flex flex-col border-r ${NEUTRAL_COLORS.neutral4.border} ${
        NEUTRAL_COLORS.neutral2.bg
      } transition-all duration-300 h-full shadow-sm`}
    >
      <div className={`flex flex-row items-center justify-end ${GRID_SYSTEM.spacing.s.padding}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${GRID_SYSTEM.spacing.xs.padding} rounded cursor-pointer ${NEUTRAL_COLORS.neutral3.hover} transition-colors ${BASIC_TEXT_COLOR.textSecondary}`}
        >
          {isOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className={`flex flex-col ${GRID_SYSTEM.spacing.xs.gap} ${GRID_SYSTEM.spacing.s.paddingX}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center cursor-pointer transition-colors rounded ${
                NEUTRAL_COLORS.neutral3.hover
              } ${activeTab === tab.id ? NEUTRAL_COLORS.neutral4.bg : ""} ${
                isOpen ? `${GRID_SYSTEM.spacing.m.paddingX} ${GRID_SYSTEM.spacing.s.paddingY}` : "h-10 justify-center"
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
          className={`w-full flex items-center ${GRID_SYSTEM.spacing.m.gap} cursor-pointer transition-colors rounded ${
            NEUTRAL_COLORS.neutral3.hover
          } ${isOpen ? `${GRID_SYSTEM.spacing.m.paddingX} ${GRID_SYSTEM.spacing.s.paddingY}` : "h-10 justify-center"}`}
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
 * MainHeader モック
 */
function MainHeader() {
  return (
    <div className={`flex items-center ${GRID_SYSTEM.spacing.l.padding} ${GRID_SYSTEM.spacing.l.gap} border-b ${NEUTRAL_COLORS.neutral4.border}`}>
      <h2 className="text-2xl font-bold whitespace-nowrap flex-1">Extreme Roles Options</h2>

      <div className={`flex items-center ${GRID_SYSTEM.spacing.s.gap} flex-1 max-w-md border ${NEUTRAL_COLORS.neutral5.border} rounded ${GRID_SYSTEM.spacing.s.paddingX} ${GRID_SYSTEM.spacing.xs.paddingY} ${NEUTRAL_COLORS.neutral1.bg}`}>
        <Search size={18} className="text-gray-400" />
        <input type="text" placeholder="Search..." className="bg-transparent outline-none w-full text-sm" />
      </div>

      <div className={`flex items-center ${GRID_SYSTEM.spacing.s.gap}`}>
        <button className={`flex items-center ${GRID_SYSTEM.spacing.s.gap} ${GRID_SYSTEM.spacing.s.paddingX} ${GRID_SYSTEM.spacing.xs.paddingY} border ${NEUTRAL_COLORS.neutral5.border} rounded ${NEUTRAL_COLORS.neutral3.hover} transition-colors`}>
          <Upload size={18} />
          <span className={TYPOGRAPHY.label.size}>Import</span>
        </button>
        <button className={`flex items-center ${GRID_SYSTEM.spacing.s.gap} ${GRID_SYSTEM.spacing.s.paddingX} ${GRID_SYSTEM.spacing.xs.paddingY} border ${NEUTRAL_COLORS.neutral5.border} rounded ${NEUTRAL_COLORS.neutral3.hover} transition-colors`}>
          <Download size={18} />
          <span className={TYPOGRAPHY.label.size}>Export</span>
        </button>
        <button className={`${GRID_SYSTEM.spacing.s.padding} border ${NEUTRAL_COLORS.neutral5.border} rounded ${NEUTRAL_COLORS.neutral3.hover} transition-colors`}>
           <RefreshCw size={18} />
        </button>
      </div>
    </div>
  );
}

/**
 * RoleCategoryAccordion モック
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

  return (
    <div className={`border ${NEUTRAL_COLORS.neutral4.border} rounded-lg overflow-hidden ${NEUTRAL_COLORS.neutral1.bg}`}>
      <div className={`flex items-center ${NEUTRAL_COLORS.neutral3.hover} transition-colors relative`}>
        {showVisualAid && <VisualAidOverlay level="l" />}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex-1 flex items-center ${GRID_SYSTEM.spacing.s.gap} ${GRID_SYSTEM.spacing.l.padding} text-left cursor-pointer`}
        >
          <div className="w-5 h-5 flex items-center justify-center">
            {isOpen ? <ChevronDown size={20} className={BASIC_TEXT_COLOR.textTertiary} /> : <ChevronRight size={20} className={BASIC_TEXT_COLOR.textTertiary} />}
          </div>
          <span className={`${TYPOGRAPHY.label.size} font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>
            {text}
          </span>
        </button>
        <div className={`${GRID_SYSTEM.spacing.l.paddingX} flex items-center`}>
           <div className={`w-8 h-8 rounded-full border ${NEUTRAL_COLORS.neutral4.border} flex items-center justify-center ${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textSecondary} ${DATA_FONT.family}`}>
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
  const paddingLeft = `${depth * 0.5 + 0.375}rem`;

  return (
    <div className={`${GRID_SYSTEM.spacing.xs.paddingY} ${NEUTRAL_COLORS.neutral3.hover} transition-colors group relative`}>
      <div className="flex items-stretch" style={{ paddingLeft }}>
        <div className="flex items-center justify-center w-10 shrink-0">
           <div className={`w-4 h-4 rounded border ${NEUTRAL_COLORS.neutral5.border}`} />
        </div>
        <div className={`flex-1 min-w-0 flex items-center justify-between ${GRID_SYSTEM.spacing.l.paddingRight} h-10`}>
           <span className={`${TYPOGRAPHY.label.size} ${BASIC_TEXT_COLOR.textPrimary}`}>
             {label}
           </span>
           <div className={`flex items-center ${GRID_SYSTEM.spacing.s.gap}`}>
             <div className={`${GRID_SYSTEM.spacing.s.paddingX} ${GRID_SYSTEM.spacing.xs.paddingY} border ${NEUTRAL_COLORS.neutral5.border} rounded ${NEUTRAL_COLORS.neutral2.bg} ${TYPOGRAPHY.small.size} ${BASIC_TEXT_COLOR.textPrimary} ${DATA_FONT.family}`}>
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

export default function GridSystem() {
  const [showVisualAid, setShowVisualAid] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={`${GRID_SYSTEM.spacing.l.padding} ${GRID_SYSTEM.spacing.l.gap} flex flex-col ${NEUTRAL_COLORS.neutral1.bg} min-h-screen pb-24`}>
      <section>
        <div className="flex justify-between items-start">
          <div>
            <h2 className={`text-2xl font-bold ${GRID_SYSTEM.spacing.l.marginBottom} ${BASIC_TEXT_COLOR.textPrimary}`}>グリッドシステム</h2>
            <p className={`${BASIC_TEXT_COLOR.textSecondary} max-w-2xl`}>
              余白を8の倍数で固定し、ルールに基づいて項目間の距離を制御します。
            </p>
          </div>
          <button
            onClick={() => setShowVisualAid(!showVisualAid)}
            className={`${GRID_SYSTEM.spacing.l.paddingX} ${GRID_SYSTEM.spacing.s.paddingY} rounded border transition-colors ${
              showVisualAid
                ? "bg-blue-100 border-blue-300 text-blue-700 font-bold"
                : `${NEUTRAL_COLORS.neutral1.bg} border-neutral-300 text-neutral-600 hover:bg-neutral-50`
            }`}
          >
            視覚補助: {showVisualAid ? "ON" : "OFF"}
          </button>
        </div>
      </section>

      {/* アプリ全体の構成例 */}
      <section className={`${GRID_SYSTEM.spacing.l.gap} flex flex-col`}>
        <h3 className={`text-xl font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>全体レイアウト構造 (Layout Structure)</h3>
        <p className={BASIC_TEXT_COLOR.textSecondary}>
          サイドバー、タブ（Selector）、メインコンテンツの配置とそれらの間の余白を確認できます。
        </p>
        <div className={`h-[500px] border ${NEUTRAL_COLORS.neutral4.border} rounded-xl overflow-hidden flex bg-white relative shadow-lg`}>
          <SidebarMock isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

          <div className="flex flex-col flex-1 overflow-hidden h-full">
            <MainHeader />

            {/* Tab Selector Area */}
            <div className={`border-b ${NEUTRAL_COLORS.neutral4.border} ${NEUTRAL_COLORS.neutral2.bg}`}>
              <div className="flex">
                {["General", "Roles", "System"].map((tab, i) => (
                  <div
                    key={tab}
                    className={`${GRID_SYSTEM.spacing.l.paddingX} ${GRID_SYSTEM.spacing.s.paddingY} ${TYPOGRAPHY.tab.size} ${
                      i === 1
                        ? `${BASIC_TEXT_COLOR.textPrimary} border-b-2 border-blue-500 font-bold`
                        : BASIC_TEXT_COLOR.textSecondary
                    }`}
                  >
                    {tab}
                  </div>
                ))}
              </div>
            </div>

            {/* Main View Area */}
            <div className={`flex-1 overflow-y-auto ${GRID_SYSTEM.spacing.l.padding} ${NEUTRAL_COLORS.neutral2.bg} relative`}>
               <div className={`flex flex-col ${GRID_SYSTEM.spacing.l.gap}`}>
                  <RoleCategoryAccordionMock text="役職設定" showVisualAid={showVisualAid}>
                     <OptionRowMock label="インポスターの数" value="2" showVisualAid={showVisualAid} />
                     <div className={`border ${NEUTRAL_COLORS.neutral4.border} rounded-lg ${NEUTRAL_COLORS.neutral1.bg} ${GRID_SYSTEM.spacing.s.padding}`}>
                        <div className={`flex items-center ${GRID_SYSTEM.spacing.s.gap} ${GRID_SYSTEM.spacing.xs.marginBottom}`}>
                           <ChevronRight size={16} className={BASIC_TEXT_COLOR.textTertiary} />
                           <span className="font-bold text-sm">マッドメイト設定</span>
                           <div className="flex-1" />
                           <div className={`${GRID_SYSTEM.spacing.s.paddingX} ${GRID_SYSTEM.spacing.xs.paddingY} bg-gray-100 rounded text-xs ${DATA_FONT.family}`}>ON</div>
                        </div>
                     </div>
                     <OptionRowMock label="クルーメイトの数" value="8" showVisualAid={showVisualAid} />
                  </RoleCategoryAccordionMock>

                  <div className={`flex justify-end ${GRID_SYSTEM.spacing.s.gap}`}>
                     <button className={`${GRID_SYSTEM.spacing.l.paddingX} ${GRID_SYSTEM.spacing.s.paddingY} rounded text-sm font-medium ${NEUTRAL_COLORS.neutral1.bg} border ${NEUTRAL_COLORS.neutral5.border} ${BASIC_TEXT_COLOR.textSecondary} ${NEUTRAL_COLORS.neutral3.hover}`}>
                       キャンセル
                     </button>
                     <button className={`${GRID_SYSTEM.spacing.l.paddingX} ${GRID_SYSTEM.spacing.s.paddingY} rounded text-sm font-medium ${PRIMARY_ACTION_COLOR.primary} text-white ${PRIMARY_ACTION_COLOR.hover} shadow-sm`}>
                       設定を保存
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 余白のテスト・調整ガイド */}
      <section className={`grid grid-cols-1 md:grid-cols-2 ${GRID_SYSTEM.spacing.l.gap}`}>
        <div className={`${GRID_SYSTEM.spacing.l.gap} flex flex-col`}>
          <h3 className={`text-xl font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>アコーディオン・イン・アコーディオン</h3>
          <p className={BASIC_TEXT_COLOR.textSecondary}>
            階層が深くなる場合のインデントと余白のバランスを確認します。
          </p>
          <div className={`border ${NEUTRAL_COLORS.neutral4.border} rounded-lg overflow-hidden ${NEUTRAL_COLORS.neutral1.bg} divide-y ${NEUTRAL_COLORS.neutral4.border}`}>
             <OptionRowMock label="ルート項目" value="Value" showVisualAid={showVisualAid} />
             <OptionRowMock label="第一階層アコーディオン" value="Expand" depth={1} showVisualAid={showVisualAid} />
          </div>
        </div>

        <div className={`${GRID_SYSTEM.spacing.l.gap} flex flex-col`}>
          <h3 className={`text-xl font-semibold ${BASIC_TEXT_COLOR.textPrimary}`}>設計・調整のヒント</h3>
          <div className={`${GRID_SYSTEM.spacing.l.padding} border-l-4 border-blue-500 bg-blue-50 ${TYPOGRAPHY.label.size}`}>
            <h4 className={`font-bold text-blue-800 ${GRID_SYSTEM.spacing.s.marginBottom}`}>実装時の注意点</h4>
            <ul className={`list-disc list-inside ${GRID_SYSTEM.spacing.s.gap} flex flex-col text-blue-700`}>
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
