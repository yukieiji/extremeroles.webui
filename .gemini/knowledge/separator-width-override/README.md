# Separatorの幅のオーバーライド

## 概要
Shadcn/UI（または @base-ui/react/separator）をベースにした `Separator` コンポーネントの幅をオーバーライドする場合、コンポーネント内で `data-horizontal:w-full` のような属性ベースのクラスが指定されていると、単純な `w-1/2` では詳細度の関係で上書きできない場合がある。

## 解決策
Tailwind CSS v4 環境において、以下のように `data-horizontal:` バリアントを使用してクラスを指定することで、詳細度を高めて確実に上書きすることができる。

```tsx
<Separator className="data-horizontal:w-1/2 mx-auto bg-border-weak" />
```

また、`mx-auto` を併用することで、幅を狭めたセパレーターを中央寄せにすることができる。
