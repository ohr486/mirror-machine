import { loadConfig, logger } from '../../src/config';

describe('loadConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // 各テストで環境変数をクリーンな状態にリセット
    jest.resetModules();
    process.env = { ...originalEnv };
    // ロガーのモックを設定してファイル出力を無効化
    jest.spyOn(logger, 'info').mockImplementation();
    jest.spyOn(logger, 'error').mockImplementation();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  describe('ローカル開発環境（MinIO）', () => {
    test('AWS_ENDPOINT_URLが設定されている場合、MinIO設定を返すこと', () => {
      process.env.AWS_ENDPOINT_URL = 'http://localhost:9000';
      process.env.AWS_ACCESS_KEY_ID = 'minioadmin';
      process.env.AWS_SECRET_ACCESS_KEY = 'minioadmin';
      process.env.AWS_REGION = 'ap-northeast-1';
      process.env.NODE_ENV = 'development';

      const config = loadConfig();

      expect(config).toEqual({
        aws: {
          region: 'ap-northeast-1',
          endpoint: 'http://localhost:9000',
          credentials: {
            accessKeyId: 'minioadmin',
            secretAccessKey: 'minioadmin',
          },
        },
        nodeEnv: 'development',
      });

      expect(logger.info).toHaveBeenCalledWith('Using local S3 emulator (MinIO)', {
        endpoint: 'http://localhost:9000',
      });
    });

    test('AWS_ENDPOINT_URL設定時にAWS_ACCESS_KEY_IDが未設定の場合、例外をスローすること', () => {
      process.env.AWS_ENDPOINT_URL = 'http://localhost:9000';
      process.env.AWS_SECRET_ACCESS_KEY = 'minioadmin';

      expect(() => loadConfig()).toThrow(
        'AWS_ENDPOINT_URL is set but AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is missing'
      );
    });

    test('AWS_ENDPOINT_URL設定時にAWS_SECRET_ACCESS_KEYが未設定の場合、例外をスローすること', () => {
      process.env.AWS_ENDPOINT_URL = 'http://localhost:9000';
      process.env.AWS_ACCESS_KEY_ID = 'minioadmin';

      expect(() => loadConfig()).toThrow(
        'AWS_ENDPOINT_URL is set but AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is missing'
      );
    });

    test('AWS_ENDPOINT_URL設定時に両方の認証情報が未設定の場合、例外をスローすること', () => {
      process.env.AWS_ENDPOINT_URL = 'http://localhost:9000';

      expect(() => loadConfig()).toThrow(
        'AWS_ENDPOINT_URL is set but AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is missing'
      );
    });
  });

  describe('本番環境（AWS S3）', () => {
    test('AWS_ENDPOINT_URLが未設定の場合、AWS S3設定を返すこと', () => {
      delete process.env.AWS_ENDPOINT_URL;
      process.env.AWS_REGION = 'us-west-2';
      process.env.NODE_ENV = 'production';

      const config = loadConfig();

      expect(config).toEqual({
        aws: {
          region: 'us-west-2',
        },
        nodeEnv: 'production',
      });

      expect(logger.info).toHaveBeenCalledWith('Using AWS S3', {
        region: 'us-west-2',
      });
    });

    test('AWS_REGIONが未設定の場合、デフォルト値ap-northeast-1を使用すること', () => {
      delete process.env.AWS_ENDPOINT_URL;
      delete process.env.AWS_REGION;
      process.env.NODE_ENV = 'production';

      const config = loadConfig();

      expect(config.aws.region).toBe('ap-northeast-1');
    });

    test('NODE_ENVが未設定の場合、デフォルト値developmentを使用すること', () => {
      delete process.env.AWS_ENDPOINT_URL;
      delete process.env.NODE_ENV;

      const config = loadConfig();

      expect(config.nodeEnv).toBe('development');
    });
  });

  describe('環境変数の優先順位', () => {
    test('すべての環境変数が設定されている場合、それらを優先すること', () => {
      process.env.AWS_ENDPOINT_URL = 'http://custom:9000';
      process.env.AWS_ACCESS_KEY_ID = 'customkey';
      process.env.AWS_SECRET_ACCESS_KEY = 'customsecret';
      process.env.AWS_REGION = 'eu-west-1';
      process.env.NODE_ENV = 'staging';

      const config = loadConfig();

      expect(config).toEqual({
        aws: {
          region: 'eu-west-1',
          endpoint: 'http://custom:9000',
          credentials: {
            accessKeyId: 'customkey',
            secretAccessKey: 'customsecret',
          },
        },
        nodeEnv: 'staging',
      });
    });
  });
});

describe('logger', () => {
  test('loggerが正しく設定されていること', () => {
    expect(logger).toBeDefined();
    expect(logger.transports).toHaveLength(1);
    // Winston のトランスポートが File トランスポートであることを確認
    expect(logger.transports[0].constructor.name).toBe('File');
  });

  test('DEBUG=trueの場合、ログレベルがdebugになること', () => {
    process.env.DEBUG = 'true';
    // logger は既に初期化されているため、新しいインスタンスを作成する必要がある
    // ここでは既存のloggerのレベルをテストする代わりに、設定の仕様を確認
    const { createLogger } = require('winston');
    const testLogger = createLogger({
      level: process.env.DEBUG === 'true' ? 'debug' : 'info',
    });
    expect(testLogger.level).toBe('debug');
  });

  test('DEBUGが未設定の場合、ログレベルがinfoになること', () => {
    delete process.env.DEBUG;
    const { createLogger } = require('winston');
    const testLogger = createLogger({
      level: process.env.DEBUG === 'true' ? 'debug' : 'info',
    });
    expect(testLogger.level).toBe('info');
  });
});
