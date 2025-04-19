# Mirror Machine

Windows および macOS デスクトップアプリケーション（Electron）

## 概要

このリポジトリは、Electronを使用したWindows および macOS デスクトップアプリケーションです。基本的なアプリケーション構造とビルド設定が含まれています。

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
# Windows用のインストーラーとポータブル版を作成
npm run win-dist

# macOS用のDMGとZIPを作成
npm run mac-dist

# 両方のプラットフォーム用にビルド
npm run dist
```

ビルドされたアプリケーションは `dist` ディレクトリに出力されます。

## プロジェクト構造

```
mirror-machine/
├── build/              # ビルドリソース（アイコンなど）
├── src/                # ソースコード
│   ├── index.html      # メインウィンドウのHTML
│   ├── renderer.js     # レンダラープロセスのスクリプト
│   ├── preload.js      # プリロードスクリプト
│   └── styles.css      # スタイルシート
├── main.js             # メインプロセスのスクリプト
├── package.json        # プロジェクト設定
└── README.md           # このファイル
```
