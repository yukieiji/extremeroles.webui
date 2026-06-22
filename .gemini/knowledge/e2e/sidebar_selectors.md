# サイドバーのE2Eテスト用セレクタについて

## 概要
サイドバーの開閉をテストする際、ボタンのタイトル（"Open Sidebar", "Close Sidebar"）による取得は、実装の変更により失敗する可能性があります。

## 推奨されるセレクタ
サイドバーの開閉ボタン（SidebarTrigger）を操作する場合は、以下のセレクタを使用してください。

```typescript
page.locator('[data-slot="sidebar-trigger"]')
```

## 理由
- `src/components/ui/sidebar.tsx` 内の `SidebarTrigger` コンポーネントに `data-slot="sidebar-trigger"` が付与されています。
- `shadcn/ui` ベースのコンポーネントでは、`data-slot` 属性を使用して要素を特定するのが安定しています。
