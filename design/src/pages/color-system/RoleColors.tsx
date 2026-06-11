import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function RoleColors() {
  const [roles, setRoles] = useState([
    { id: "role-1", name: "Role 1", color: "#3b82f6" },
    { id: "role-2", name: "Role 2", color: "#ef4444" },
    { id: "role-3", name: "Role 3", color: "#10b981" },
  ]);

  const updateColor = (id: string, color: string) => {
    setRoles(roles.map((r) => (r.id === id ? { ...r, color } : r)));
  };

  const [activeTabId, setActiveTabId] = useState(roles[0].id);
  const activeRole = roles.find(r => r.id === activeTabId) || roles[0];

  return (
    <div className="p-4 space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-4">役職カラーパレット (Role Colors)</h2>
        <p className="mb-6 text-sm text-gray-500">
          デザイン定義チェックリストに基づいた役職カラーパレットです。
          ブラウザ上で色を調整して、コンポーネントへの適用イメージを確認できます。
        </p>
      </div>

      {/* 色調整UI */}
      <section className="bg-gray-50 p-6 rounded-lg border space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">カラー調整</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="space-y-2">
              <Label htmlFor={role.id}>{role.name}</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id={role.id}
                  value={role.color}
                  onInput={(e) => updateColor(role.id, e.currentTarget.value)}
                  className="w-12 h-12 block bg-transparent rounded cursor-pointer border-none"
                />
                <code className="bg-white px-2 py-1 rounded border text-sm flex-1">
                  {role.color}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 説明文 */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">説明</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
          <li>
            <strong>各役職のカラー</strong>:
            役職のアコーディオンヘッダー(リニアーグラディアントの右)とアコーディオンの境界線(ヘッダーとコンテンツの境界には使用しない)
          </li>
          <li>
            <strong>タブのカラー</strong>:
            タブ選択中のインジケーターとタブ選択中の枠の色
          </li>
        </ul>
      </section>

      {/* サンプルコンポーネント */}
      <section className="space-y-8">
        <h3 className="text-lg font-semibold border-b pb-2">サンプルコンポーネント</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* アコーディオンサンプル */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-600">アコーディオン (Accordion)</h4>
            <div className="space-y-4">
              {roles.map((role) => (
                <AccordionSample key={role.id} role={role} />
              ))}
            </div>
          </div>

          {/* タブサンプル */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-600">タブ (Tabs)</h4>
            <Tabs
              value={activeTabId}
              onValueChange={setActiveTabId}
              className="w-full flex flex-col"
            >
              <TabsList className="w-full justify-start rounded-none bg-transparent p-0 h-auto gap-1 border-b-0">
                {roles.map((role) => (
                  <TabsTrigger
                    key={role.id}
                    value={role.id}
                    style={{ "--tab-color": role.color } as React.CSSProperties}
                    className="border-2 border-b-0 rounded-t-lg py-2 px-4 transition-colors data-[state=active]:border-[var(--tab-color)] data-[state=inactive]:border-gray-200 data-[state=inactive]:bg-gray-50"
                  >
                    {role.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {roles.map((role) => (
                <TabsContent
                  key={role.id}
                  value={role.id}
                  className="p-6 border-2 rounded-b-lg rounded-tr-lg -mt-[2px] min-h-[100px]"
                  style={{ borderColor: activeRole.color }}
                >
                  <p className="text-sm">
                    {role.name} のコンテンツが表示されています。
                    タブ選択中のインジケーター（タブの境界線）と枠（コンテンツの境界線）の色に <strong>{role.color}</strong> が適用されています。
                  </p>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}

function AccordionSample({ role }: { role: { name: string; color: string } }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className="border-2 rounded-lg overflow-hidden"
      style={{ borderColor: role.color }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 font-bold transition-all text-left"
        style={{
          background: `linear-gradient(to right, #ffffff, ${role.color})`,
        }}
      >
        <span>{role.name} アコーディオン</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          <p className="text-sm text-gray-600">
            アコーディオンヘッダーの右側にリニアーグラデーションとして <strong>{role.color}</strong> が使用されています。
            また、外側の境界線にも同じ色が適用されています。
          </p>
        </div>
      )}
    </div>
  );
}
