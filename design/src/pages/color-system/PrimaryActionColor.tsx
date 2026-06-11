import { BASIC_TEXT_COLOR, PRIMARY_ACTION_COLOR } from "../../designConstants";
import { SyncButton } from "@/components/parts/SyncButton";
import { ExportButton } from "@/components/parts/ExportButton";
import { RoleFilterAddButton } from "@/feature/rolefilter/RoleFilterAddButton";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

export default function PrimaryActionColor() {
  const primaryActionClass = `${PRIMARY_ACTION_COLOR.primary} ${PRIMARY_ACTION_COLOR.foreground}`;

  const handleDummyClick = (name: string) => {
    console.log(`${name} clicked`);
    alert(`${name}がクリックされました`);
  };

  return (
    <div className="p-4 space-y-12">
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${BASIC_TEXT_COLOR.textPrimary}`}>プライマリーアクション色</h2>
        <p className={`mb-6 text-sm ${BASIC_TEXT_COLOR.textSecondary}`}>
          「保存」「追加」など、ユーザーが次に行うべき主要なアクションを示す色です。
          <code className="bg-gray-100 p-1 rounded ml-2 text-black">design/src/designConstants.ts</code> で色味を調整できます。
        </p>
      </div>

      <section className="space-y-4">
        <div className={`border-b pb-2 ${BASIC_TEXT_COLOR.textPrimary}`}>
          <h3 className="text-lg font-semibold">現在の設定</h3>
          <div className="flex gap-4 items-center mt-2">
            <span>Primary: <code className="bg-gray-100 p-1 rounded text-black">{PRIMARY_ACTION_COLOR.primary}</code></span>
            <span>Foreground: <code className="bg-gray-100 p-1 rounded text-black">{PRIMARY_ACTION_COLOR.foreground}</code></span>
          </div>
        </div>

        <div className="space-y-8 mt-8">
          {/* SyncButton Sample */}
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${BASIC_TEXT_COLOR.textSecondary}`}>SyncButton (同期ボタン)</h4>
            <div className="flex items-center gap-4">
              <SyncButton
                onClick={() => handleDummyClick("SyncButton")}
                className={primaryActionClass}
              />
              <span className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>アイコンのみの主要アクション</span>
            </div>
          </div>

          {/* ExportButton Sample */}
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${BASIC_TEXT_COLOR.textSecondary}`}>ExportButton (エクスポートボタン)</h4>
            <div className="flex items-center gap-4">
              <ExportButton
                onClick={() => handleDummyClick("ExportButton")}
                className={primaryActionClass}
              />
              <span className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>アイコンとテキストの主要アクション</span>
            </div>
          </div>

          {/* RoleFilterAddButton Sample */}
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${BASIC_TEXT_COLOR.textSecondary}`}>RoleFilterAddButton (フィルター追加ボタン)</h4>
            <div className="flex items-center gap-4">
              <RoleFilterAddButton
                onClick={() => handleDummyClick("RoleFilterAddButton")}
                className={primaryActionClass}
              />
              <span className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>機能を含む主要アクションボタン</span>
            </div>
          </div>

          {/* Simple Icon Buttons Sample */}
          <div className="space-y-2">
            <h4 className={`text-sm font-medium ${BASIC_TEXT_COLOR.textSecondary}`}>Simple Icon Buttons (+ / -)</h4>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button
                  size="icon"
                  className={primaryActionClass}
                  onClick={() => handleDummyClick("Plus Button")}
                >
                  <Plus size={20} />
                </Button>
                <Button
                  size="icon"
                  className={primaryActionClass}
                  onClick={() => handleDummyClick("Minus Button")}
                >
                  <Minus size={20} />
                </Button>
              </div>
              <span className={`text-xs ${BASIC_TEXT_COLOR.textTertiary}`}>シンプルな追加・削除ボタンの例</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
