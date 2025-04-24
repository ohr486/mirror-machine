# Mirror Machine

Mirror Machineは、Electron + TypeScriptで構築されたデスクトップアプリケーションです。

## 必要条件

- Node.js (v16以上)
- npm (v7以上)

## インストール

リポジトリをクローンし、依存関係をインストールします：

```bash
git clone git@github-ohr486:ohr486/mirror-machine.git
cd mirror-machine
npm install
```

## 開発

開発モードでアプリケーションを実行するには：

```bash
# TypeScriptのコンパイル（ウォッチモード）
npm run watch

# 別のターミナルでアプリケーションを起動
npm start
```

## ビルド

アプリケーションをビルドするには：

```bash
npm run build
```

## プロジェクト構造

```
mirror-machine/
├── src/              # ソースコード
│   └── main.ts       # メインプロセス
├── index.html        # メインウィンドウ
├── package.json      # プロジェクト設定
└── tsconfig.json     # TypeScript設定
```

## スクリプト

- `npm start` - アプリケーションを起動
- `npm run build` - TypeScriptのコンパイル
- `npm run watch` - TypeScriptの自動コンパイル（開発用）

## ライセンス

ISC

## 作者

ohr486 