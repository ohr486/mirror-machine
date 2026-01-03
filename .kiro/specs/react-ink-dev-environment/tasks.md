# Implementation Plan

## Overview
React Inkフレームワークを使用したTUIアプリケーション開発環境の実装。DevContainer、Makefile、MinIOエミュレーション、TypeScriptビルドツールチェーンを統合し、即座に開発開始可能な環境を構築する。

## Tasks

- [ ] 1. プロジェクト基盤とパッケージ管理のセットアップ
- [x] 1.1 (P) package.jsonとTypeScript設定を作成
  - package.jsonでプロジェクトメタデータ、依存関係（React Ink、AWS SDK、winston等）、npmスクリプト（dev、test、lint、format）を定義
  - tsconfig.jsonでstrictモード、React JSX変換、Node.js型定義を設定
  - package-lock.jsonでバージョン固定を保証
  - _Requirements: 2.1, 2.2, 7.1, 7.2, 7.3, 7.5, 8.1, 8.2, 8.4, 8.5, 9.1_

- [x] 1.2 (P) ESLintとPrettier設定を作成
  - .eslintrc.jsonでTypeScript/Reactルールセット、eslint-config-prettierとの統合を設定
  - .prettierrc.jsonでコードスタイル（セミコロン、シングルクォート、printWidth等）を定義
  - ESLintとPrettierが競合しない設定を保証
  - _Requirements: 5.1, 5.2, 5.3, 5.5, 6.1, 6.2, 6.4_

- [ ] 2. Makefileとビルドツールチェーンの実装
- [ ] 2.1 Makefileで統一されたタスクインターフェースを提供
  - test、lint、format、cleanup、dev、logsターゲットを実装
  - helpターゲットで利用可能なコマンド一覧を表示
  - 各ターゲットからnpm scriptsに委譲（例: `make test` → `npm test`）
  - cleanupターゲットでnode_modules、coverage、dist、.turboを削除
  - logsターゲットで`logs/app.log`をtail表示
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12_

- [ ] 3. docker-composeとMinIOエミュレーション環境の構築
- [ ] 3.1 docker-compose.ymlでMinIOコンテナを定義
  - MinIO最新イメージを使用し、ポート9000（S3 API）と9001（Web UI）を公開
  - 環境変数でMINIO_ROOT_USER/PASSWORDを設定（minioadmin）
  - minio_dataボリュームでデータ永続化を設定
  - healthcheckでMinIOの稼働状態を監視（curl /minio/health/live）
  - _Requirements: 10.1, 10.2, 10.3, 10.7_

- [ ] 3.2 MinIO初期セットアップスクリプトを作成
  - scripts/init-minio.shでdocker execを使用してMinIOコンテナ内のmcコマンドを実行
  - mcでローカルエイリアス設定（http://localhost:9000）
  - デフォルトバケット（my-app-bucket）を作成（--ignore-existingオプション）
  - バケット一覧を表示して確認
  - _Requirements: 10.8_

- [ ] 3.3 Makefileにdocker-compose関連ターゲットを追加
  - up、down、pull、build、init-minioターゲットを実装
  - upターゲットはpullを依存関係に含め、初回実行時にイメージをダウンロード
  - init-minioターゲットはscripts/init-minio.shを実行
  - _Requirements: 3.1, 10.3_

- [ ] 4. DevContainerとインフラストラクチャ自動化
- [ ] 4.1 DevContainer設定ファイルを作成
  - .devcontainer/devcontainer.jsonでNode.js 20 LTSベースイメージを指定
  - customizationsでVSCode拡張機能（ESLint、Prettier、TypeScript）を自動インストール
  - containerEnvで環境変数（AWS_ENDPOINT_URL、AWS_ACCESS_KEY_ID等）をデフォルト設定
  - updateContentCommandで`npm install`を自動実行
  - postStartCommandで`.devcontainer/post-start.sh`を実行
  - forwardPortsでポート3000、9000、9001を転送
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.4_

- [ ] 4.2 post-start.shでMinIO自動起動と初期化を実装
  - docker-compose up -dでMinIO起動
  - healthcheck完了待機（最大60秒、curl /minio/health/liveでポーリング）
  - healthcheck成功後、scripts/init-minio.shを実行
  - エラー発生時は明確なメッセージを出力（例: "MinIO healthcheck timeout"）
  - _Requirements: 1.4, 10.3, 10.8_

- [ ] 5. 環境変数管理とアプリケーション設定
- [ ] 5.1 (P) .env.exampleで環境変数のサンプルを提供
  - AWS_ENDPOINT_URL、AWS_ACCESS_KEY_ID、AWS_SECRET_ACCESS_KEY、AWS_REGION、NODE_ENVの例を記載
  - ローカル開発用のデフォルト値（MinIO: http://localhost:9000）と本番環境用のコメント例を含む
  - README.mdに「DevContainerで自動設定されるため、通常は.envファイル不要」と記載
  - _Requirements: 10.4, 10.5_

- [ ] 5.2 src/config.tsで環境変数バリデーションと設定管理を実装
  - AppConfigインターフェースで型安全な設定オブジェクトを定義（aws.region、aws.endpoint、aws.credentials、nodeEnv）
  - loadConfig()関数で環境変数を読み込み、バリデーション実施
  - AWS_ENDPOINT_URL設定時は認証情報（AWS_ACCESS_KEY_ID、AWS_SECRET_ACCESS_KEY）の存在を検証、未設定なら例外スロー
  - winstonロガーを設定し、logs/app.logにファイル出力（DEBUGモード対応）
  - ローカル開発（MinIO）と本番環境（AWS S3）の切り替えロジックを実装
  - _Requirements: 10.4, 10.5, 10.6_

- [ ] 6. React Inkアプリケーションのエントリーポイント実装
- [ ] 6.1 src/cli.tsxでTUIアプリケーションの基本構造を作成
  - loadConfig()でAppConfigを取得し、環境変数の型安全な利用を保証
  - S3Clientを初期化（config.aws.region、config.aws.endpoint、config.aws.credentials使用）
  - ListBucketsCommandでS3バケット一覧を取得し、状態管理（useState）
  - エラーハンドリング（try-catch）でS3接続エラーをキャッチ、winstonロガーでログ出力
  - React InkコンポーネントでTUI表示（Box、Textコンポーネント使用）
  - バケット一覧をmapで表示、エラー時は赤色Text表示
  - render()でAppコンポーネントをマウント
  - _Requirements: 2.3, 2.4, 2.5, 9.2, 9.4, 9.5, 10.5, 10.6_

- [ ] 6.2 開発モードとホットリロードの動作確認
  - npm run devでtsxがwatch modeで起動することを確認
  - ソースコード変更時の自動再起動を検証
  - TUI出力が標準出力に直接表示され、バッファリング遅延がないことを確認
  - winstonログがlogs/app.logに正しく出力されることを確認
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 7. テストフレームワークとテストインフラの構築
- [ ] 7.1 (P) jest.config.jsでJestとink-testing-library統合を設定
  - ts-jestプリセットでTypeScript変換を設定
  - testEnvironmentをnodeに設定
  - testMatchパターンで*.test.tsx、*.spec.tsxファイルを検出
  - transformでjsx: 'react-jsx'を設定
  - collectCoverageFromでsrc/**/*.{ts,tsx}をカバレッジ対象に設定（テストファイル、型定義ファイル除外）
  - coverageDirectoryをcoverageに設定、reportersでtext、lcov、htmlを出力
  - _Requirements: 4.1, 4.3_

- [ ] 7.2* (P) AppコンポーネントとAppConfigの基本テストを作成
  - src/__tests__/cli.test.tsxでAppコンポーネントの初期レンダリングテスト（ink-testing-library使用）
  - lastFrame()で"Hello"表示を検証
  - S3Clientのモックを作成し、バケット一覧取得のテスト
  - エラー発生時の状態遷移テスト
  - src/__tests__/config.test.tsでloadConfig()の環境変数パターンテスト（MinIO/AWS、認証情報有無）
  - 環境変数未設定時の例外スローテスト
  - _Requirements: 4.2, 4.4, 4.5_

- [ ] 8. READMEドキュメントの作成
- [ ] 8.1 README.mdで開発環境セットアップ手順を記載
  - Quick Startセクションで4ステップのセットアップ手順（Clone → Open in Cursor/VSCode → Reopen in Container → make dev）
  - DevContainer起動で自動的に依存関係インストール、MinIO起動、初期セットアップが完了することを明記
  - Available Commandsセクションでmake help、make dev、make test、make lint、make format、make logs、make cleanup等を列挙
  - Environment Variablesセクションで環境変数のデフォルト設定（DevContainerで自動適用）を説明
  - MinIO Configurationセクションで Web UI（http://localhost:9001）、S3 API（http://localhost:9000）、認証情報、自動作成バケット（my-app-bucket）を記載
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.6_

- [ ] 8.2 README.mdにReact Inkコンポーネント例とトラブルシューティングを追加
  - React Ink Component Exampleセクションでsrc/cli.tsxのサンプルコードを参照
  - Architecture Overviewセクションで主要技術（DevContainer、MinIO、React Ink、Winston、TypeScript）を簡潔に説明
  - Troubleshootingセクションで一般的な問題（DevContainer起動遅延、MinIO接続エラー、TypeScript型エラー、環境変数読み込み、ログ表示）と解決策を記載
  - _Requirements: 11.5, 11.7_

- [ ] 9. 統合テストとエンドツーエンド検証
- [ ] 9.1 DevContainer起動からアプリ実行までの統合フローを検証
  - DevContainerを起動し、updateContentCommand（npm install）が成功することを確認
  - postStartCommand（post-start.sh）が実行され、MinIOが起動・初期化されることを確認
  - http://localhost:9001でMinIO Web UIにアクセス可能なことを確認
  - make devでTUIアプリが起動し、S3バケット一覧が表示されることを確認
  - logs/app.logにwinstonログが出力されていることを確認
  - _Requirements: 1.2, 1.4, 10.3, 10.8, 9.2_

- [ ] 9.2 Makefileの全ターゲットとツールチェーン動作を検証
  - make testでJestが実行され、テストスイートが成功することを確認
  - make lintでESLintが実行され、コード品質チェックが成功することを確認
  - make formatでPrettierが適用され、コードスタイルが統一されることを確認
  - make cleanupでnode_modules、coverageが削除されることを確認
  - make logsでlogs/app.logがtail表示されることを確認
  - make upでMinIOが起動し、make downで停止することを確認
  - _Requirements: 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 5.3, 5.4, 6.3_

- [ ] 9.3 環境変数による本番/ローカル切り替え動作を検証
  - AWS_ENDPOINT_URLが設定されている場合、MinIOに接続することを確認（loadConfig()のログ出力検証）
  - AWS_ENDPOINT_URLが未設定の場合、AWS S3への接続設定になることを確認（モックテスト）
  - 認証情報（AWS_ACCESS_KEY_ID、AWS_SECRET_ACCESS_KEY）の検証ロジックが動作することを確認
  - _Requirements: 10.4, 10.5, 10.6_

## Requirements Coverage

全11要件（Requirement 1-11）を以下のタスクでカバー：

- **Requirement 1 (DevContainer開発環境)**: 4.1, 4.2, 9.1
- **Requirement 2 (React Inkフレームワーク統合)**: 1.1, 6.1
- **Requirement 3 (Makefileベースのビルドツールチェーン)**: 2.1, 3.3, 9.2
- **Requirement 4 (テストフレームワーク)**: 7.1, 7.2
- **Requirement 5 (リントとコード品質)**: 1.2, 9.2
- **Requirement 6 (コードフォーマット)**: 1.2, 9.2
- **Requirement 7 (TypeScript設定)**: 1.1
- **Requirement 8 (依存関係管理)**: 1.1
- **Requirement 9 (開発ワークフロー)**: 1.1, 6.1, 6.2, 9.1
- **Requirement 10 (ローカルS3エミュレーション環境)**: 3.1, 3.2, 3.3, 4.1, 4.2, 5.1, 5.2, 6.1, 9.1, 9.3
- **Requirement 11 (ドキュメンテーション)**: 8.1, 8.2

すべての要件が実装タスクにマッピングされている。
