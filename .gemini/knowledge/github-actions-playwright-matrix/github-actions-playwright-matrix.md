# GitHub ActionsでのPlaywrightテストの並列化 (Strategy Matrix)

GitHub Actionsの `strategy.matrix` を使用して、Playwrightのテストをブラウザごとに並列実行する方法について。

## 背景
Playwrightは標準でマルチプロジェクト（複数ブラウザ）をサポートしているが、1つのジョブ内で順次実行すると実行時間が長くなる。GitHub Actionsの並列実行機能を使うことで、全体の実行時間を短縮できる。

## 設定方法

### 1. ワークフローファイル (.yml) の設定

`strategy.matrix` を定義し、それぞれのジョブで特定のプロジェクトを指定して実行する。

```yaml
jobs:
  e2e:
    strategy:
      fail-fast: false # 1つのブラウザが失敗しても他のブラウザのテストを継続する
      matrix:
        browser: [chromium, firefox, webkit]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v6

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright Browsers
        # 必要なブラウザのみインストールして時間を節約
        run: pnpm exec playwright install --with-deps ${{ matrix.browser }}

      - name: Run Playwright tests
        # 指定したブラウザのプロジェクトのみ実行
        run: pnpm exec playwright test --project=${{ matrix.browser }}

      - name: Upload Report
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v7
        with:
          # アーティファクト名が衝突しないようにブラウザ名を含める
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/
```

### 2. リリースジョブとの組み合わせ (`needs`)

全てのブラウザテストが成功した後にリリースを行いたい場合は、`needs` を使用する。

```yaml
jobs:
  e2e:
    # ... 上記の設定 ...

  release:
    needs: e2e
    runs-on: ubuntu-latest
    steps:
      # e2eが全てパスした場合のみ実行される
      - name: Build and Release
        run: ...
```

## メリット
- **実行時間の短縮**: ブラウザごとに別々のVMで並列実行される。
- **リソースの効率化**: 必要なブラウザバイナリのみをインストールできる。
- **デバッグの容易性**: ブラウザごとに個別のレポートが生成される。

## 注意点
- **アーティファクト名**: 並列実行する場合、`upload-artifact` で保存する名前が同じだと上書きされたりエラーになったりするため、必ず一意な名前を付ける。
- **並列数**: GitHub Actionsの無料枠や制限に応じて、`max-parallel` などを設定することも検討する。
