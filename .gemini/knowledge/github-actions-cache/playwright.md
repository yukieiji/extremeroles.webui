# GitHub Actions での Playwright ブラウザキャッシュ

GitHub Actions で Playwright の E2E テストを実行する際、ブラウザのダウンロード時間を短縮するためにキャッシュを利用する方法についての知識。

## キャッシュの対象

Playwright のブラウザバイナリは、デフォルトで以下のディレクトリに保存される。
- Linux: `~/.cache/ms-playwright`
- macOS: `~/Library/Caches/ms-playwright`
- Windows: `%USERPROFILE%\AppData\Local\ms-playwright`

GitHub Actions の Ubuntu runner では `~/.cache/ms-playwright` をキャッシュ対象とする。

## キャッシュキーの設計

キャッシュの整合性を保つために、以下の要素をキャッシュキーに含めるのが望ましい。
- OS 名 (`runner.os`)
- Playwright のバージョン
- 対象のブラウザ (matrix で実行している場合など)

Playwright のバージョンは `pnpm exec playwright --version` コマンドから取得できる。

## ワークフローの実装例

```yaml
    - name: Get Playwright version
      id: playwright-version
      run: echo "version=$(pnpm exec playwright --version | cut -d' ' -f2)" >> $GITHUB_OUTPUT

    - name: Cache Playwright Browsers
      id: cache-playwright
      uses: actions/cache@v4
      with:
        path: ~/.cache/ms-playwright
        key: ${{ runner.os }}-playwright-${{ steps.playwright-version.outputs.version }}-${{ matrix.browser }}

    - name: Install Playwright Browsers
      if: steps.cache-playwright.outputs.cache-hit != 'true'
      run: pnpm run setup:browser ${{ matrix.browser }}
```

## 注意点

- `playwright install --with-deps` を使用する場合、`--with-deps` によってインストールされるシステムレベルの依存関係（OS パッケージなど）はキャッシュされない。バイナリ（ブラウザ本体）のみがキャッシュされる。
- キャッシュヒット時でも、Playwright が正しく動作するために必要なシステム依存関係が不足している場合は、別途インストールが必要になる場合があるが、標準的な Ubuntu runner では多くの場合バイナリのキャッシュだけで十分高速化される。
