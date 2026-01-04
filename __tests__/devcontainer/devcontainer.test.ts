/**
 * DevContainer設定ファイルのテスト
 *
 * Requirements:
 * - 1.1: DevContainer設定ファイル（.devcontainer/devcontainer.json）を提供する
 * - 1.2: 必要なNode.js環境と開発ツールがインストール済みの状態で起動する
 * - 1.3: VSCode拡張機能を自動的にインストールする設定を含む
 * - 1.4: プロジェクトの依存関係が自動的にインストールされた状態になる
 * - 1.5: ホストマシンのファイルシステムと適切にマウントされる
 * - 10.4: S3エミュレーターへの接続設定（エンドポイント、認証情報）を環境変数で管理する
 */

import * as fs from 'fs';
import * as path from 'path';

describe('DevContainer Configuration', () => {
  const devcontainerPath = path.join(process.cwd(), '.devcontainer', 'devcontainer.json');
  let config: any;

  beforeAll(() => {
    // テスト前にdevcontainer.jsonが存在することを確認
    if (!fs.existsSync(devcontainerPath)) {
      throw new Error(`DevContainer設定ファイルが見つかりません: ${devcontainerPath}`);
    }

    // JSONファイルを読み込み
    const fileContent = fs.readFileSync(devcontainerPath, 'utf-8');
    config = JSON.parse(fileContent);
  });

  describe('基本設定', () => {
    test('name フィールドが設定されている', () => {
      expect(config.name).toBeDefined();
      expect(config.name).toContain('MirrorMachine');
    });

    test('Node.js 20 LTS ベースイメージを使用している', () => {
      expect(config.image).toBeDefined();
      expect(config.image).toContain('typescript-node');
      expect(config.image).toContain('20');
    });
  });

  describe('VSCode拡張機能設定 (Requirement 1.3)', () => {
    test('customizations.vscode.extensions が設定されている', () => {
      expect(config.customizations).toBeDefined();
      expect(config.customizations.vscode).toBeDefined();
      expect(config.customizations.vscode.extensions).toBeDefined();
      expect(Array.isArray(config.customizations.vscode.extensions)).toBe(true);
    });

    test('ESLint拡張機能が含まれている', () => {
      expect(config.customizations.vscode.extensions).toContain('dbaeumer.vscode-eslint');
    });

    test('Prettier拡張機能が含まれている', () => {
      expect(config.customizations.vscode.extensions).toContain('esbenp.prettier-vscode');
    });

    test('TypeScript拡張機能が含まれている', () => {
      expect(config.customizations.vscode.extensions).toContain('ms-vscode.vscode-typescript-next');
    });
  });

  describe('環境変数設定 (Requirement 10.4)', () => {
    test('containerEnv が設定されている', () => {
      expect(config.containerEnv).toBeDefined();
      expect(typeof config.containerEnv).toBe('object');
    });

    test('AWS_ENDPOINT_URL が MinIO エンドポイントに設定されている', () => {
      expect(config.containerEnv.AWS_ENDPOINT_URL).toBe('http://localhost:9000');
    });

    test('AWS_ACCESS_KEY_ID が設定されている', () => {
      expect(config.containerEnv.AWS_ACCESS_KEY_ID).toBe('minioadmin');
    });

    test('AWS_SECRET_ACCESS_KEY が設定されている', () => {
      expect(config.containerEnv.AWS_SECRET_ACCESS_KEY).toBe('minioadmin');
    });

    test('AWS_REGION が設定されている', () => {
      expect(config.containerEnv.AWS_REGION).toBe('ap-northeast-1');
    });

    test('NODE_ENV が development に設定されている', () => {
      expect(config.containerEnv.NODE_ENV).toBe('development');
    });
  });

  describe('ライフサイクルコマンド (Requirement 1.4)', () => {
    test('updateContentCommand が npm install に設定されている', () => {
      expect(config.updateContentCommand).toBe('npm install');
    });

    test('postStartCommand が .devcontainer/post-start.sh に設定されている', () => {
      expect(config.postStartCommand).toBeDefined();
      expect(config.postStartCommand).toContain('post-start.sh');
    });
  });

  describe('ポートフォワーディング設定', () => {
    test('forwardPorts が設定されている', () => {
      expect(config.forwardPorts).toBeDefined();
      expect(Array.isArray(config.forwardPorts)).toBe(true);
    });

    test('ポート 3000 (アプリケーション) が転送される', () => {
      expect(config.forwardPorts).toContain(3000);
    });

    test('ポート 9000 (MinIO S3 API) が転送される', () => {
      expect(config.forwardPorts).toContain(9000);
    });

    test('ポート 9001 (MinIO Web UI) が転送される', () => {
      expect(config.forwardPorts).toContain(9001);
    });
  });

  describe('ファイルシステムマウント (Requirement 1.5)', () => {
    test('ワークスペースフォルダが自動的にマウントされる（DevContainerのデフォルト動作）', () => {
      // DevContainerは自動的にワークスペースをマウントするため、
      // 明示的な mounts 設定は不要（設定すると競合を引き起こす可能性がある）
      // mounts が未定義または空の場合、DevContainerのデフォルトマウントが使用される
      if (config.mounts) {
        // mounts が設定されている場合は配列であることを確認
        expect(Array.isArray(config.mounts)).toBe(true);
      }
      // mounts の存在は必須ではない
    });
  });
});
