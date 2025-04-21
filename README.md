# Mirror Machine

macOS デスクトップアプリケーション（Electron）

## 概要

このリポジトリは、Electronを使用したmacOSデスクトップアプリケーションです。基本的なアプリケーション構造とビルド設定が含まれています。

## 開発環境のセットアップ

### 必要条件

- Node.js (v14以上)
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/ohr486/mirror-machine.git
cd mirror-machine

# 依存関係のインストール
npm install
```

## 開発

```bash
# 開発モードでアプリを起動
npm run dev
```

## ビルド

```bash
# macOS用のDMGとZIPを作成
npm run dist
```

ビルドされたアプリケーションは `dist` ディレクトリに出力されます。

## テストとリント

```bash
# テストを実行
npm test

# テストをウォッチモードで実行（変更を監視）
npm run test:watch

# リントを実行
npm run lint

# リントを実行して自動修正
npm run lint:fix
```

## プロジェクト構造

```
mirror-machine/
├── build/              # ビルドリソース（アイコンなど）
├── src/                # ソースコード
│   ├── index.html      # メインウィンドウのHTML
│   ├── renderer.js     # レンダラープロセスのスクリプト
│   ├── preload.js      # プリロードスクリプト
│   └── styles.css      # スタイルシート
├── __tests__/          # テストファイル
│   ├── main.test.ts    # メインプロセスのテスト
│   └── renderer.test.ts # レンダラープロセスのテスト
├── main.ts             # メインプロセスのスクリプト
├── package.json        # プロジェクト設定
├── .eslintrc.js        # ESLint設定
├── jest.config.js      # Jestテスト設定
├── tsconfig.json       # TypeScript設定
└── README.md           # このファイル
```
