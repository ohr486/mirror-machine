/**
 * PostStartScriptのテスト
 *
 * Requirements:
 * - 1.4: プロジェクトの依存関係が自動的にインストールされた状態になる
 * - 10.3: S3エミュレーターがローカル環境でS3互換APIを提供する
 * - 10.8: S3エミュレーターの初期セットアップスクリプト（バケット作成等）を提供する
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

describe('PostStartScript', () => {
  const postStartPath = path.join(process.cwd(), '.devcontainer', 'post-start.sh');

  describe('スクリプトの存在と実行権限', () => {
    test('post-start.sh が存在する', () => {
      expect(fs.existsSync(postStartPath)).toBe(true);
    });

    test('post-start.sh が実行可能である', () => {
      const stats = fs.statSync(postStartPath);
      // 実行権限チェック（所有者、グループ、またはその他のいずれかに実行権限がある）
      const isExecutable = (stats.mode & 0o111) !== 0;
      expect(isExecutable).toBe(true);
    });
  });

  describe('スクリプトの構文とコンテンツ', () => {
    let scriptContent: string;

    beforeAll(() => {
      scriptContent = fs.readFileSync(postStartPath, 'utf-8');
    });

    test('shebang行が存在する', () => {
      expect(scriptContent).toMatch(/^#!\/bin\/bash/);
    });

    test('set -e が設定されている（エラー時即座に終了）', () => {
      expect(scriptContent).toContain('set -e');
    });

    test('docker-compose up -d コマンドが含まれている', () => {
      expect(scriptContent).toMatch(/docker-compose\s+up\s+-d/);
    });

    test('MinIO healthcheckの待機ロジックが含まれている', () => {
      // forループでhealthcheckを待機
      expect(scriptContent).toMatch(/for\s+\w+\s+in\s+\{1\.\.60\}/);
      expect(scriptContent).toMatch(/docker\s+exec.*curl.*health\/live/);
    });

    test('healthcheck成功時のメッセージが含まれている', () => {
      expect(scriptContent).toMatch(/MinIO is ready/i);
    });

    test('healthcheckタイムアウト時のエラーメッセージが含まれている', () => {
      expect(scriptContent).toMatch(/MinIO healthcheck timeout/i);
      // タイムアウト時はexit 1で終了
      expect(scriptContent).toMatch(/exit 1/);
    });

    test('init-minio.sh の実行コマンドが含まれている', () => {
      expect(scriptContent).toMatch(/bash.*scripts\/init-minio\.sh/);
    });

    test('完了メッセージが含まれている', () => {
      expect(scriptContent).toMatch(/Development environment ready/i);
    });
  });

  describe('シェルスクリプト構文チェック', () => {
    test('bash構文エラーがない', () => {
      // bash -n でスクリプトの構文チェック
      expect(() => {
        execSync(`bash -n ${postStartPath}`, { encoding: 'utf-8' });
      }).not.toThrow();
    });
  });

  describe('スクリプトの論理フロー', () => {
    let scriptContent: string;

    beforeAll(() => {
      scriptContent = fs.readFileSync(postStartPath, 'utf-8');
    });

    test('docker-compose起動 → healthcheck待機 → init-minio.sh実行の順序になっている', () => {
      const dockerComposeIndex = scriptContent.indexOf('docker-compose up -d');
      const healthcheckIndex = scriptContent.indexOf('curl');
      const initMinioIndex = scriptContent.indexOf('init-minio.sh');

      expect(dockerComposeIndex).toBeGreaterThan(-1);
      expect(healthcheckIndex).toBeGreaterThan(dockerComposeIndex);
      expect(initMinioIndex).toBeGreaterThan(healthcheckIndex);
    });

    test('healthcheckループが適切にbreakする', () => {
      // healthcheck成功時にbreakでループを抜ける
      const breakPattern = /if.*curl.*health\/live.*then[\s\S]*?break/;
      expect(scriptContent).toMatch(breakPattern);
    });

    test('60秒経過後にタイムアウトする', () => {
      // $i -eq 60 のチェックが存在する
      expect(scriptContent).toMatch(/\$i\s*-eq\s*60/);
    });
  });

  describe('エラーハンドリング', () => {
    let scriptContent: string;

    beforeAll(() => {
      scriptContent = fs.readFileSync(postStartPath, 'utf-8');
    });

    test('set -e でエラー時に即座に終了する', () => {
      expect(scriptContent).toContain('set -e');
    });

    test('healthcheckタイムアウト時にexit 1で終了する', () => {
      // タイムアウトチェックとexit 1が同じif文内にある
      const timeoutPattern = /if\s*\[\s*\$i\s*-eq\s*60\s*\];?\s*then[\s\S]*?exit 1/;
      expect(scriptContent).toMatch(timeoutPattern);
    });
  });
});
