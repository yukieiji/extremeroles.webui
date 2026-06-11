import React, { useState } from "react";

// Mock component to match src/components/blocks/RoleCategoryAccordion.tsx
const AccordionSample = ({
  title,
  roleColor,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  roleColor: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="mb-4 overflow-hidden rounded-md border border-gray-700 bg-gray-800">
      <div
        className="flex h-10 w-full cursor-pointer items-center justify-between pr-4 transition-all hover:bg-gray-700/50"
        style={{
          background: `linear-gradient(to right, transparent, ${roleColor}66)`,
        }}
        onClick={onToggle}
      >
        <div className="flex h-full items-center gap-x-3">
          <div
            className="h-full w-[10px]"
            style={{ backgroundColor: roleColor }}
          />
          <span className="text-sm font-medium text-gray-200">
            {isOpen ? "▼" : "▶"} {title}
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="flex h-6 items-center rounded bg-gray-700/50 px-2 text-[10px] text-gray-400">
            自動同期
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="border-t border-gray-700 bg-gray-900/30 p-4 text-sm text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

// Mock component to match Tabs behavior
const TabsSample = ({
  roles,
  activeRoleIndex,
  onTabChange,
  roleColors,
}: {
  roles: string[];
  activeRoleIndex: number;
  onTabChange: (index: number) => void;
  roleColors: string[];
}) => {
  const activeColor = roleColors[activeRoleIndex];
  return (
    <div className="flex flex-col">
      <div className="flex gap-x-1 px-1">
        {roles.map((role, index) => (
          <button
            key={role}
            onClick={() => onTabChange(index)}
            className={`rounded-t-md px-4 py-2 text-sm transition-colors ${
              activeRoleIndex === index
                ? "bg-gray-800 text-gray-100"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
            }`}
            style={
              activeRoleIndex === index
                ? { borderTop: `2px solid ${activeColor}` }
                : {}
            }
          >
            {role}
          </button>
        ))}
      </div>
      <div
        className="rounded-md border bg-gray-800 p-6"
        style={{ borderColor: activeColor }}
      >
        <div className="mb-4 text-gray-300">
          <strong style={{ color: activeColor }}>{roles[activeRoleIndex]}</strong>{" "}
          のコンテンツが表示されています。タブ上部のインジケーターと、コンテンツ枠の色に
          <code className="mx-1 rounded bg-gray-900 px-1 py-0.5 text-gray-100">
            {activeColor}
          </code>
          が適用されています。
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4
              className="border-b border-gray-700 pb-1 text-xs font-bold uppercase tracking-wider text-gray-500"
            >
              一般設定
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">権限の継承</span>
              <div className="h-5 w-10 rounded-full bg-gray-700" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">表示設定</span>
              <div className="h-5 w-10 rounded-full bg-gray-600" />
            </div>
          </div>
          <div className="space-y-4">
            <h4
              className="border-b border-gray-700 pb-1 text-xs font-bold uppercase tracking-wider text-gray-500"
            >
              詳細設定
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>優先度スコア</span>
                <span>75</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-700">
                <div
                  className="h-full rounded-full"
                  style={{ width: "75%", backgroundColor: activeColor }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoleColors = () => {
  const [roleColors, setRoleColors] = useState(["#ffff00", "#ef4444", "#10b981"]);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState(0);

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...roleColors];
    newColors[index] = color;
    setRoleColors(newColors);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h2 className="mb-2 text-2xl font-bold">役職カラーパレット (Role Colors)</h2>
        <p className="text-muted-foreground">
          デザイン定義チェックリストに基づいた役職カラーパレットです。ブラウザ上で色を調整して、コンポーネントへの適用イメージを確認できます。
        </p>
      </header>

      <section className="mb-12 rounded-lg border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">カラー調整</h3>
        <div className="flex flex-wrap gap-8">
          {roleColors.map((color, index) => (
            <div key={index} className="flex flex-col gap-2">
              <label className="text-sm font-medium">Role {index + 1}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded border-none bg-transparent"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="w-24 rounded border border-input bg-background px-2 py-1 text-sm uppercase"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h3 className="mb-4 text-lg font-semibold">説明</h3>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>
            <strong className="text-foreground">各役職のカラー:</strong>{" "}
            役職のアコーディオンヘッダー（10pxの左端バーと、右方向へのリニアグラディエント）および、スライダーなどのアクセント色に使用されます。
          </li>
          <li>
            <strong className="text-foreground">タブのカラー:</strong>{" "}
            タブ選択中の上部インジケーターと、コンテンツエリアの境界線の色に使用されます。
          </li>
        </ul>
      </section>

      <section>
        <h3 className="mb-6 text-lg font-semibold">サンプルコンポーネント</h3>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Accordion Samples */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">
              アコーディオン (Accordion)
            </h4>
            {roleColors.map((color, index) => (
              <AccordionSample
                key={index}
                title={`Role ${index + 1} アコーディオン`}
                roleColor={color}
                isOpen={openAccordion === index}
                onToggle={() =>
                  setOpenAccordion(openAccordion === index ? null : index)
                }
              >
                <p className="mb-4">
                  アコーディオンヘッダーの左端に10pxのバーとして
                  <code className="mx-1 rounded bg-gray-800 px-1 py-0.5 text-gray-200">
                    {color}
                  </code>
                  が使用されています。また、ヘッダー背景には透明から
                  <code className="mx-1 rounded bg-gray-800 px-1 py-0.5 text-gray-200">
                    {color}66
                  </code>
                  （不透明度40%）へのグラデーションが適用されています。
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded border border-gray-700 bg-gray-800/50 p-3">
                    <div className="mb-1 text-xs font-bold text-gray-400">
                      基本オプション
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      有効化済み
                    </div>
                  </div>
                  <div className="rounded border border-gray-700 bg-gray-800/50 p-3">
                    <div className="mb-1 text-xs font-bold text-gray-400">
                      感度調整
                    </div>
                    <div className="h-1 w-full rounded-full bg-gray-700">
                      <div
                        className="h-full rounded-full"
                        style={{ width: "40%", backgroundColor: color }}
                      />
                    </div>
                  </div>
                </div>
              </AccordionSample>
            ))}
          </div>

          {/* Tabs Samples */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-muted-foreground">
              タブ (Tabs)
            </h4>
            <TabsSample
              roles={roleColors.map((_, i) => `Role ${i + 1}`)}
              activeRoleIndex={activeTab}
              onTabChange={setActiveTab}
              roleColors={roleColors}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoleColors;
