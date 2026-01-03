# Research & Design Decisions

## Summary
- **Feature**: `react-ink-dev-environment`
- **Discovery Scope**: New Feature (Greenfield)
- **Key Findings**:
  - React Inkは最新版でTypeScriptフルサポート、create-ink-appでプロジェクト初期化が推奨
  - S3エミュレーターはLocalStackよりMinIOが軽量で専用UI提供、シンプルなS3のみのユースケースに最適
  - DevContainerはmcr.microsoft.com/devcontainers/typescriptnodeイメージを使用し、updateContentCommandで依存関係管理を最適化
  - ESLint/Prettier競合解決にはeslint-config-prettierを使用、v8.0.0以降は"prettier"のみ拡張で十分

## Research Log

### React Ink最新バージョンとTypeScript統合

- **Context**: React Inkの最新バージョンとTypeScriptセットアップのベストプラクティスを調査
- **Sources Consulted**:
  - [React Ink公式ドキュメント](https://context7.com/vadimdemedes/ink)
  - [ink-testing-library GitHub](https://github.com/vadimdemedes/ink-testing-library)
- **Findings**:
  - `npx create-ink-app --typescript my-ink-cli`でTypeScriptプロジェクトを初期化可能
  - エントリーポイントは`render()`関数でReactコンポーネントツリーをstdoutにマウント
  - `ink-testing-library`を使用してコンポーネント単位でテスト可能（`render()`, `lastFrame()`, `stdin.write()`メソッド）
  - React 18のJSX変換（`jsx: "react-jsx"`）をサポート
- **Implications**:
  - TypeScript strictモード対応の型定義が完備されている
  - テストはJest + ink-testing-libraryの組み合わせが標準

### DevContainer構成とNode.js/TypeScript環境

- **Context**: DevContainerのベストプラクティスと推奨構成を調査
- **Sources Consulted**:
  - [DevContainer best practices 2026](https://code.visualstudio.com/docs/devcontainers/create-dev-container)
  - [Microsoft devcontainers/typescript-node](https://github.com/microsoft/vscode-dev-containers)
- **Findings**:
  - 推奨ベースイメージ: `mcr.microsoft.com/devcontainers/typescript-node:0-20`（Node.js 20 LTS）
  - `updateContentCommand`ライフサイクルプロパティで新規依存関係のみインストール、環境作成を高速化
  - `postStartCommand`で開発サーバー自動起動（例: `npm run dev --host 0.0.0.0`）
  - `forwardPorts`で開発サーバーポート公開（通常3000番ポート）
  - `customizations.vscode.extensions`でESLint/Prettier等の拡張機能を自動インストール
- **Implications**:
  - Cursor/VSCode互換の拡張機能設定が可能
  - 環境構築の再現性が担保される

### S3エミュレーター比較: MinIO vs LocalStack

- **Context**: ローカルS3開発環境の最適なエミュレーター選定
- **Sources Consulted**:
  - [MinIO vs LocalStack comparison](https://blog.localstack.cloud/2024-04-08-exploring-s3-mocking-tools-a-comparative-analysis-of-s3mock-minio-and-localstack/)
  - [SingleStore migration case study](https://www.singlestore.com/blog/migrating-from-minio-to-localstack/)
- **Findings**:
  - **MinIO**: S3専用、軽量、無料、専用CLI（mc）とWebUI提供、セルフホスト可能
  - **LocalStack**: AWS全サービスエミュレート、S3以外も必要な場合に有用、永続化機能はPro版のみ（v2.0.0以降）
  - docker-compose起動コマンド:
    - MinIO: `docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"`
    - LocalStack: `docker run -p 4566:4566 localstack/localstack:s3-latest`
  - MinIO利用で約2,000行のコード削減事例あり（本番AWS SDK、ローカルMinIO SDKの2重管理が不要に）
- **Implications**:
  - S3のみのユースケースではMinIOが軽量でシンプル
  - MinIOのWebUI（ポート9001）で視覚的なバケット管理が可能
  - 環境変数でエンドポイント切り替え設計が必須

### TypeScript Strict Mode設定

- **Context**: TypeScript strictモードの推奨設定を調査
- **Sources Consulted**:
  - [TypeScript TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
  - [React with TypeScript best practices](https://www.sitepoint.com/react-with-typescript-best-practices/)
- **Findings**:
  - `"strict": true`は複数の型チェックフラグを包括（`noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`等）
  - React JSX用設定: `"jsx": "react-jsx"`（React 17以降の新JSX変換）
  - 推奨追加フラグ: `"esModuleInterop": true`, `"skipLibCheck": true`, `"forceConsistentCasingInFileNames": true`
  - `"noEmit": true`でTypeScriptコンパイル出力を抑制（型チェックのみ実行）
- **Implications**:
  - 型安全性を最大化する設定が標準化されている
  - ビルドはBabelやesbuild等の別ツールで実行するのが現代的

### ESLint/Prettier競合解決

- **Context**: ESLintとPrettierの競合を回避する構成を調査
- **Sources Consulted**:
  - [eslint-config-prettier GitHub](https://github.com/prettier/eslint-config-prettier)
  - [TypeScript React ESLint setup guide](https://medium.com/@robinviktorsson/setting-up-eslint-and-prettier-for-a-typescript-project-aa2434417b8f)
- **Findings**:
  - `eslint-config-prettier` v8.0.0以降は`"prettier"`のみ拡張すれば全プラグイン対応
  - `eslint-plugin-prettier`でPrettierをESLintルールとして実行
  - extendsの最後に`"plugin:prettier/recommended"`を配置してフォーマットルール上書き
  - CLIツールで競合チェック可能
- **Implications**:
  - 設定がシンプル化され、保守性が向上
  - `--fix`フラグで自動修正が統合される

### Makefile構成パターン

- **Context**: Node.jsプロジェクト向けMakefileのベストプラクティスを調査
- **Sources Consulted**:
  - [Makefile for Node.js developers](https://zentered.co/articles/makefile-for-node-js-developers/)
  - [Node.js official Makefile](https://github.com/nodejs/node/blob/main/Makefile)
- **Findings**:
  - `.PHONY`宣言でターゲット名とファイル名の競合回避
  - ローカルnode_modulesのバイナリを使用（`BIN := ./node_modules/.bin`）
  - タスク依存関係管理（例: `deploy`ターゲットが`lint test build`に依存）
  - セルフドキュメント化（`##`コメントでhelpターゲット自動生成）
- **Implications**:
  - 統一されたコマンドインターフェースで開発効率向上
  - CI/CDパイプラインとの統合が容易

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| Monorepo Structure | 単一リポジトリでTUIアプリとツールチェーンを管理 | シンプル、セットアップが容易 | アプリ肥大化時のスケーラビリティ懸念 | 初期フェーズに最適 |
| Feature-Sliced Design | 機能単位でディレクトリ分割 | 保守性向上、並行開発しやすい | 小規模プロジェクトでは過剰 | 将来的な拡張を見据えて推奨 |
| Container-First Development | DevContainerとdocker-composeを開発環境の基盤とする | 環境差異の排除、再現性 | Docker学習コスト | 要件に合致、採用 |

## Design Decisions

### Decision: S3エミュレーターとしてMinIOを選定

- **Context**: ローカル開発環境でS3互換ストレージが必要
- **Alternatives Considered**:
  1. MinIO — S3専用、軽量、無料、WebUI付き
  2. LocalStack — AWS全サービス対応、永続化はPro版のみ
- **Selected Approach**: MinIO
- **Rationale**:
  - S3のみのユースケースで十分
  - 軽量でリソース消費が少ない
  - 無料版で永続化サポート
  - WebUI（ポート9001）で視覚的管理が可能
- **Trade-offs**:
  - Benefits: シンプル、高速起動、追加コスト不要
  - Compromises: S3以外のAWSサービスが必要になった場合は移行が必要
- **Follow-up**: 初期セットアップスクリプトでデフォルトバケット作成を自動化

### Decision: TypeScript strictモードを有効化

- **Context**: 型安全性と開発効率のバランス
- **Alternatives Considered**:
  1. strictモードなし — 導入障壁低い、型エラー少ない
  2. strictモード有効 — 型安全性最大、実行時エラー削減
- **Selected Approach**: strictモード有効（`"strict": true`）
- **Rationale**:
  - React Inkの型定義が完備されており、strictモード対応
  - TUIアプリは状態管理が複雑になりがちで、型による保護が有効
- **Trade-offs**:
  - Benefits: バグの早期発見、リファクタリング安全性向上
  - Compromises: 初期コーディング時の型エラー対応コスト増
- **Follow-up**: チーム向けにTypeScript型システム基礎ドキュメント作成

### Decision: Makefileをタスクランナーとして採用

- **Context**: npm scriptsとMakefileの選択
- **Alternatives Considered**:
  1. npm scripts のみ — Node.jsエコシステム標準
  2. Makefile — 依存関係管理、統一インターフェース
- **Selected Approach**: Makefile
- **Rationale**:
  - 要件で明示的にMakefile指定
  - タスク依存関係の宣言的管理が可能
  - CI/CDとの統合が容易
- **Trade-offs**:
  - Benefits: 統一されたコマンド体系、依存関係自動解決
  - Compromises: Windows環境での追加セットアップ必要
- **Follow-up**: Windows開発者向けにWSL/Git Bashセットアップガイド作成

### Decision: ink-testing-libraryをテストフレームワークとして採用

- **Context**: TUIコンポーネントのテスト戦略
- **Alternatives Considered**:
  1. ink-testing-library + Jest — 公式推奨、React Testing Library風API
  2. カスタムテストハーネス — 柔軟性高い
- **Selected Approach**: ink-testing-library + Jest
- **Rationale**:
  - React Ink公式が推奨
  - `render()`, `lastFrame()`, `stdin.write()`でインタラクティブテスト可能
  - React Testing Libraryの思想を継承、学習コスト低い
- **Trade-offs**:
  - Benefits: コミュニティサポート、豊富なサンプル
  - Compromises: 複雑な非同期レンダリングのテストが難しい場合あり
- **Follow-up**: TUIコンポーネントのテストパターン集作成

### Decision: Makefileにpull/buildターゲットを追加

- **Context**: docker-compose起動時のイメージ管理の明示化
- **Alternatives Considered**:
  1. pull/buildターゲット追加、upをpullに依存 — 明示的、将来の拡張性高い
  2. upターゲットで自動pull（--pull always） — シンプル
  3. 現状維持（自動pullのみ） — 暗黙的、ユーザー混乱の可能性
- **Selected Approach**: pull/buildターゲット追加（提案1）
- **Rationale**:
  - 初回起動時のイメージpullを明示化、ユーザー体験向上
  - 将来的なカスタムDockerfileビルドに対応可能
  - `make up`がpullに依存することで、常に最新イメージを保証
- **Trade-offs**:
  - Benefits: 明示的な操作、将来の拡張性、トラブルシューティング容易
  - Compromises: ターゲット数増加（軽微）
- **Follow-up**: README.mdに各ターゲットの用途を明記

## Risks & Mitigations

- **Risk 1**: DevContainerの初回起動が遅い（イメージダウンロード、依存関係インストール）
  - **Mitigation**: updateContentCommandで差分インストールのみ実行、README.mdに初回起動時間の目安を記載
- **Risk 2**: MinIOと本番AWS S3のAPI互換性に差異がある可能性
  - **Mitigation**: 環境変数で接続先切り替え、統合テストで両環境検証、AWS SDK v3使用で互換性最大化
- **Risk 3**: Makefileに不慣れな開発者の学習コスト
  - **Mitigation**: セルフドキュメント化（`make help`）、README.mdに主要コマンド説明、VS Code tasks.jsonでMakeターゲットをGUI化

## References

- [React Ink公式ドキュメント](https://github.com/vadimdemedes/ink) — React for CLIs
- [ink-testing-library](https://github.com/vadimdemedes/ink-testing-library) — テストユーティリティ
- [DevContainer best practices](https://code.visualstudio.com/docs/devcontainers/create-dev-container) — VSCode公式ガイド
- [MinIO vs LocalStack comparison](https://blog.localstack.cloud/2024-04-08-exploring-s3-mocking-tools-a-comparative-analysis-of-s3mock-minio-and-localstack/) — S3エミュレーター比較
- [TypeScript TSConfig Reference](https://www.typescriptlang.org/tsconfig/) — 公式リファレンス
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) — ESLint/Prettier競合解決
- [Makefile for Node.js developers](https://zentered.co/articles/makefile-for-node-js-developers/) — Node.js向けMakefileガイド
