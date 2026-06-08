# ExtremeRoles.WebUI

ExtremeRoles.WebUIは、[ExtremeRoles](https://github.com/yukieiji/ExtremeRoles)がインストールされた環境の設定を、高速かつ直感的に行うためのWebユーザーインターフェースです。

## 🚀 技術スタック

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4
- **Lint/Format**: Biome
- **Testing**: Vitest, Playwright (E2E)
- **State Management**: Zustand
- **Icons**: Lucide React

## 📂 ディレクトリ構造

```text
.
├── e2e/                # PlaywrightによるE2Eテスト
├── mocks/              # MSWのモック定義
├── public/             # 静的アセット
├── src/
│   ├── assets/         # 画像、フォントなどのアセット
│   ├── components/     # 再利用可能なUIコンポーネント
│   │   ├── blocks/     # 複数のパーツを組み合わせたコンポーネント
│   │   ├── parts/      # 最小単位のUIパーツ
│   │   └── ui/         # Shadcn/UIベースの基本コンポーネント
│   ├── feature/        # 機能ごとのコンポーネント
│   │   ├── amongus/    # Among Us向け設定
│   │   ├── exr/        # ExtremeRoles向け設定
│   │   ├── rightsidepanel/ # 右側プレビューパネル
│   │   └── rolefilter/ # ロールフィルター機能
│   ├── hooks/          # カスタムフック
│   ├── lib/            # 外部ライブラリの設定やユーティリティ
│   ├── logics/         # ビジネスロジック
│   ├── slices/         # Zustandのステート分割
│   ├── App.tsx         # メインアプリケーションコンポーネント
│   ├── main.tsx        # エントリーポイント
│   ├── useStore.ts     # メインのステート管理
│   └── type.ts         # 型定義
├── tests/              # Vitestによるユニット/統合テスト
└── ...
```

## 🛠 インストールと開発

このプロジェクトでは `pnpm` を使用しています。

### セットアップ

依存関係をインストールします：
```bash
pnpm install
```

開発環境の初期セットアップ（Lefthookのインストールなど）：
```bash
pnpm setup:dev
```

### 開発サーバーの起動

通常モード：
```bash
pnpm dev
```

モックサーバー（MSW）を使用した開発：
```bash
pnpm dev:mock
```

### ビルド

本番環境向けにビルドします：
```bash
pnpm build
```

### テスト

ユニットテスト（Vitest）の実行：
```bash
pnpm test
```

E2Eテスト（Playwright）の実行：
```bash
# 初回実行時はブラウザのインストールが必要です
pnpm setup:browser

# E2Eテストの実行
pnpm e2e
```

### リンター・フォーマッター

Biomeによるチェックと修正：
```bash
pnpm check   # チェックのみ
pnpm format  # 整形
pnpm lint    # リンター実行
```

## 📄 ライセンス

このプロジェクトは **AGPLv3** ライセンスの下で公開されています。詳細は [LICENSE](./LICENSE) ファイルを参照してください。
