# Mirror Machine

Mirror Machineは、Electron + TypeScriptで構築されたデスクトップアプリケーションです。

## 目次

- [必要条件](#必要条件)
- [インストール](#インストール)
- [開発](#開発)
- [ビルド](#ビルド)
- [テストとリント](#テストとリント)
- [プロジェクト構造](#プロジェクト構造)
- [スクリプト](#スクリプト)
- [ライセンス](#ライセンス)
- [作者](#作者)

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

## テストとリント

### リント

コードの品質を確保するために、ESLintを使用しています。以下のコマンドでリントを実行できます：

```bash
# リントを実行
npm run lint

# リントを実行して自動修正
npm run lint:fix
```

### テスト

Jestを使用してユニットテストを実行します。テストはElectronプロセスを起動せずに実行されます：

```bash
# テストを実行
npm test
```

テストファイルは `__tests__` ディレクトリに配置されています：

- `__tests__/main.test.js` - メインプロセスのテスト
- `__tests__/renderer.test.js` - レンダラープロセスのテスト

## プロジェクト構造

```
mirror-machine/
├── src/              # ソースコード
│   └── main.ts       # メインプロセス
├── __tests__/        # テストファイル
├── index.html        # メインウィンドウ
├── package.json      # プロジェクト設定
└── tsconfig.json     # TypeScript設定
```

## スクリプト

- `npm start` - アプリケーションを起動
- `npm run build` - TypeScriptのコンパイル
- `npm run watch` - TypeScriptの自動コンパイル（開発用）
- `npm run lint` - ESLintによるコード検証
- `npm run lint:fix` - ESLintによるコード検証と自動修正
- `npm test` - Jestによるテスト実行

## ライセンス

ISC

## 作者

ohr486 
