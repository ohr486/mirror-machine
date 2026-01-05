import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('.env.example', () => {
  const envExamplePath = join(process.cwd(), '.env.example');

  test('ファイルが存在すること', () => {
    expect(existsSync(envExamplePath)).toBe(true);
  });

  test('必要な環境変数がすべて定義されていること', () => {
    const content = readFileSync(envExamplePath, 'utf-8');

    // 必須の環境変数キーが含まれていることを確認
    expect(content).toContain('AWS_ENDPOINT_URL');
    expect(content).toContain('AWS_ACCESS_KEY_ID');
    expect(content).toContain('AWS_SECRET_ACCESS_KEY');
    expect(content).toContain('AWS_REGION');
    expect(content).toContain('NODE_ENV');
  });

  test('ローカル開発用のデフォルト値が設定されていること', () => {
    const content = readFileSync(envExamplePath, 'utf-8');

    // MinIOのデフォルト設定
    expect(content).toContain('http://localhost:9000');
    expect(content).toContain('minioadmin');
    expect(content).toContain('ap-northeast-1');
    expect(content).toContain('development');
  });

  test('本番環境の設定例がコメントで記載されていること', () => {
    const content = readFileSync(envExamplePath, 'utf-8');

    // 本番環境の例がコメントとして存在することを確認
    expect(content).toMatch(/本番環境/);
    expect(content).toMatch(/production/);
  });

  test('DevContainer自動設定に関する説明が含まれていること', () => {
    const content = readFileSync(envExamplePath, 'utf-8');

    // DevContainerで自動設定されることの説明
    expect(content).toMatch(/DevContainer.*自動設定/);
  });
});
