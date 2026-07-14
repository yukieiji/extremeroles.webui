import { useState } from "react";
import { useDesignTheme } from "../../themeContext";
import {
  Settings,
  ChevronRight,
  ChevronDown,
  Info,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { TYPOGRAPHY } from "../../designConstants";

/**
 * サイドバーのモック
 */
function SidebarMock() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Au");
  const { basicTextColor, neutralColors } = useDesignTheme();

  const tabs = [
    { id: "Au", label: "Among Us Options", shortLabel: "Au" },
    { id: "ExR", label: "Extreme Roles Options", shortLabel: "ExR" },
    { id: "RoleFilter", label: "Role Filter", shortLabel: "Role" },
  ];

  return (
    <div
      className={`flex flex-col h-80 border ${neutralColors.neutral5.border} ${
        neutralColors.neutral2.bg
      } transition-all duration-300 ${isOpen ? "w-56" : "w-14"}`}
    >
      <div className="flex justify-end p-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1 rounded cursor-pointer ${neutralColors.neutral3.hover} transition-colors`}
        >
          {isOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center cursor-pointer transition-colors rounded ${
                neutralColors.neutral3.hover
              } ${
                activeTab === tab.id
                  ? neutralColors.neutral4.bg
                  : ""
              } ${isOpen ? "px-3 py-2" : "h-10 justify-center"}`}
            >
              {isOpen ? (
                <span
                  className={`${TYPOGRAPHY.sidebar.size} ${TYPOGRAPHY.sidebar.weight} ${basicTextColor.textPrimary} truncate`}
                >
                  {tab.label}
                </span>
              ) : (
                <span
                  className={`${TYPOGRAPHY.sidebar.size} font-bold ${basicTextColor.textPrimary}`}
                >
                  {tab.shortLabel}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className={`p-2 border-t ${neutralColors.neutral4.border}`}>
        <button
          className={`w-full flex items-center gap-3 cursor-pointer transition-colors rounded ${
            neutralColors.neutral3.hover
          } ${isOpen ? "px-3 py-2" : "h-10 justify-center"}`}
        >
          <Settings size={20} className="shrink-0" />
          {isOpen && (
            <span
              className={`${TYPOGRAPHY.sidebar.size} ${TYPOGRAPHY.sidebar.weight} ${basicTextColor.textPrimary}`}
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
 * タブのモック
 */
function TabMock() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["General", "Roles", "System"];
  const { basicTextColor, neutralColors } = useDesignTheme();

  return (
    <div className={`flex border-b ${neutralColors.neutral4.border} ${neutralColors.neutral1.bg}`}>
      {tabs.map((tab, index) => (
        <button
          key={tab}
          onClick={() => setActiveTab(index)}
          className={`px-4 py-2 relative cursor-pointer transition-colors ${neutralColors.neutral3.hover} ${
            activeTab === index
              ? basicTextColor.textPrimary
              : basicTextColor.textSecondary
          }`}
        >
          <span className={`${TYPOGRAPHY.tab.size} ${TYPOGRAPHY.tab.weight}`}>
            {tab}
          </span>
          {activeTab === index && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
      ))}
    </div>
  );
}

/**
 * OptionRowのモック
 * レイアウト: [ラベル] [設定値] [フォーマット]
 */
function OptionRowMock({
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
      className={`flex items-center gap-4 p-3 border-b ${neutralColors.neutral4.border} ${neutralColors.neutral3.hover} cursor-pointer transition-colors ${neutralColors.neutral1.bg}`}
    >
      {/* 左側: 設定名 */}
      <div className="flex-1 min-w-0">
        <span
          className={`${TYPOGRAPHY.childlabel.size} ${TYPOGRAPHY.childlabel.weight} ${basicTextColor.textPrimary} break-words`}
        >
          {name}
        </span>
      </div>

      {/* 右側: 設定値 & フォーマット */}
      <div className="shrink-0 flex items-center gap-2">
        <div
          className={`px-2 py-1 border ${neutralColors.neutral5.border} rounded ${neutralColors.neutral2.bg} ${TYPOGRAPHY.childlabel.size} ${TYPOGRAPHY.childlabel.weight} ${basicTextColor.textPrimary} min-w-[3.5rem] text-center`}
        >
          {value}
        </div>
        {format && (
          <div className="flex flex-col items-start">
            <span
              className={`${TYPOGRAPHY.small.size} ${TYPOGRAPHY.small.weight} ${basicTextColor.textSecondary}`}
            >
              {format}
            </span>
          </div>
        )}
        <Info size={14} style={{ color: semanticColors.info }} />
      </div>
    </div>
  );
}

/**
 * アコーディオンのモック
 */
function AccordionMock({
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

export default function FontSizeWeight() {
  const { basicTextColor, neutralColors } = useDesignTheme();

  return (
    <div className={`p-6 space-y-12 ${neutralColors.neutral1.bg} min-h-screen`}>
      <section>
        <h2 className="text-2xl font-bold mb-4">フォントサイズ・ウェイト階層</h2>
        <p className={`${basicTextColor.textSecondary} mb-8`}>
          デザインシステムで定義されたフォントサイズとウェイトの階層です。
          各コンポーネントの用途に合わせて適切なスタイルを適用します。
        </p>
      </section>

      {/* サイドバー */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-4">
          <h3 className="text-xl font-semibold">サイドバー (Sidebar)</h3>
          <span
            className={`${TYPOGRAPHY.small.size} ${basicTextColor.textTertiary}`}
          >
            {TYPOGRAPHY.sidebar.size} / {TYPOGRAPHY.sidebar.weight}
          </span>
        </div>
        <div className="space-y-1">
          <p className={basicTextColor.textSecondary}>
            {TYPOGRAPHY.sidebar.description}
          </p>
          <p className={`${TYPOGRAPHY.small.size} ${basicTextColor.textTertiary}`}>
            ※ 各項目にマウスを合わせるとホバー状態（{neutralColors.neutral3.hex}）を確認できます。
          </p>
        </div>
        <div
          className={`p-6 border rounded ${neutralColors.neutral4.border} ${neutralColors.neutral2.bg} shadow-inner flex justify-center`}
        >
          <SidebarMock />
        </div>
      </section>

      {/* タブ */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-4">
          <h3 className="text-xl font-semibold">タブ (Tab)</h3>
          <span
            className={`${TYPOGRAPHY.small.size} ${basicTextColor.textTertiary}`}
          >
            {TYPOGRAPHY.tab.size} / {TYPOGRAPHY.tab.weight}
          </span>
        </div>
        <div className="space-y-1">
          <p className={basicTextColor.textSecondary}>
            {TYPOGRAPHY.tab.description}
          </p>
          <p className={`${TYPOGRAPHY.small.size} ${basicTextColor.textTertiary}`}>
            ※ タブにマウスを合わせるとホバー状態（{neutralColors.neutral3.hex}）を確認できます。
          </p>
        </div>
        <div
          className={`p-6 border rounded ${neutralColors.neutral4.border} ${neutralColors.neutral2.bg} shadow-inner`}
        >
          <TabMock />
        </div>
      </section>

      {/* ラベル & 小 (OptionRow / Accordion) */}
      <section className="space-y-4">
        <div className="flex items-baseline gap-4">
          <h3 className="text-xl font-semibold">ラベル & 小 (Label & Small)</h3>
          <div className="flex gap-4">
            <span
              className={`${TYPOGRAPHY.small.size} ${basicTextColor.textTertiary}`}
            >
              Label: {TYPOGRAPHY.label.size} / {TYPOGRAPHY.label.weight}
            </span>
            <span
              className={`${TYPOGRAPHY.small.size} ${basicTextColor.textTertiary}`}
            >
              Small: {TYPOGRAPHY.small.size} / {TYPOGRAPHY.small.weight}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className={basicTextColor.textSecondary}>
            {TYPOGRAPHY.label.description}
          </p>
          <p className={basicTextColor.textSecondary}>
            {TYPOGRAPHY.small.description}
          </p>
          <p className={`${TYPOGRAPHY.small.size} ${basicTextColor.textTertiary}`}>
            ※ アコーディオンヘッダーおよび各設定行（OptionRow）にマウスを合わせるとホバー状態（{neutralColors.neutral3.hex}）を確認できます。
          </p>
        </div>
        <div
          className={`p-6 border rounded ${neutralColors.neutral4.border} ${neutralColors.neutral2.bg} shadow-inner space-y-4`}
        >
          <AccordionMock title="ゲーム設定">
            <OptionRowMock name="インポスターの数" value="2" format="x 人" />
            <OptionRowMock name="推奨設定を使用" value="OFF" format="" />
            <OptionRowMock name="緊急会議の回数" value="1" format="x 回" />
            <OptionRowMock
              name="追放時の役割確認"
              value="ON"
              format="Confirm Ejects"
            />
          </AccordionMock>
        </div>
      </section>
    </div>
  );
}
