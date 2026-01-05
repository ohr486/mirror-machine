import winston from 'winston';
import { mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

export interface AppConfig {
  aws: {
    region: string;
    endpoint?: string;
    credentials?: {
      accessKeyId: string;
      secretAccessKey: string;
    };
  };
  nodeEnv: string;
}

/**
 * Cached logger instance, created lazily on first access.
 */
let _logger: winston.Logger | null = null;

/**
 * Creates and returns the application-wide logger instance.
 *
 * The logger is configured with:
 * - Log level: `debug` when the `DEBUG` environment variable is set to `'true'`,
 *   otherwise `info`.
 * - Format: JSON with an added timestamp for each log entry.
 * - Transport: writes all logs to the file `logs/app.log`.
 *
 * This function ensures the logger is created lazily on first access to avoid
 * side effects during module initialization. The logs directory is automatically
 * created if it doesn't exist.
 *
 * @returns {winston.Logger} The logger instance.
 */
function getLogger(): winston.Logger {
  if (!_logger) {
    const logFile = 'logs/app.log';
    const logDir = dirname(logFile);

    // Ensure the logs directory exists
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }

    _logger = winston.createLogger({
      level: process.env.DEBUG === 'true' ? 'debug' : 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [new winston.transports.File({ filename: logFile })],
    });
  }
  return _logger;
}

/**
 * Application-wide logger instance.
 *
 * This logger is created lazily on first access to avoid side effects during
 * module initialization. It should be imported and reused across the application
 * so that all components share consistent logging behavior and output destination.
 *
 * The logs directory is automatically created if it doesn't exist.
 */
export const logger = {
  get info(): winston.LeveledLogMethod {
    return getLogger().info.bind(getLogger());
  },
  get error(): winston.LeveledLogMethod {
    return getLogger().error.bind(getLogger());
  },
  get warn(): winston.LeveledLogMethod {
    return getLogger().warn.bind(getLogger());
  },
  get debug(): winston.LeveledLogMethod {
    return getLogger().debug.bind(getLogger());
  },
  get level(): string {
    return getLogger().level;
  },
  get transports(): winston.transport[] {
    return getLogger().transports;
  },
};

/**
 * Loads the application configuration from environment variables.
 *
 * This function should typically be called once during application startup to
 * construct an {@link AppConfig} object, which can then be passed to other
 * components that need AWS/MinIO settings or the current `NODE_ENV`.
 *
 * Behavior:
 * - **Local MinIO (S3 emulator)**: When `AWS_ENDPOINT_URL` is set, the function
 *   assumes a local S3-compatible endpoint (such as MinIO). In this case:
 *   - `aws.endpoint` is set to `AWS_ENDPOINT_URL`.
 *   - `aws.region` is taken from `AWS_REGION` (default: `ap-northeast-1`).
 *   - Static credentials are required from `AWS_ACCESS_KEY_ID` and
 *     `AWS_SECRET_ACCESS_KEY`, and included under `aws.credentials`.
 *   A log entry indicating use of the local S3 emulator is written via
 *   {@link logger}.
 *
 * - **Production AWS S3**: When `AWS_ENDPOINT_URL` is not set, the function
 *   assumes real AWS S3. In this case:
 *   - Only `aws.region` is set (from `AWS_REGION`, default: `ap-northeast-1`).
 *   - No explicit credentials are included in the returned config, so callers
 *     are expected to rely on the default AWS credential provider chain (for
 *     example IAM roles or environment configuration).
 *   A log entry indicating use of AWS S3 is written via {@link logger}.
 *
 * The `nodeEnv` field is always set from `NODE_ENV` (default: `development`).
 *
 * @throws {Error} If `AWS_ENDPOINT_URL` is set but either
 *   `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` is missing, because local
 *   MinIO access requires explicit credentials.
 *
 * @returns {AppConfig} The resolved application configuration based on the
 *   current environment variables.
 */
export function loadConfig(): AppConfig {
  const awsEndpoint = process.env.AWS_ENDPOINT_URL;
  const awsRegion = process.env.AWS_REGION || 'ap-northeast-1';
  const nodeEnv = process.env.NODE_ENV || 'development';

  // ローカル開発環境（MinIO）の場合、認証情報が必要
  if (awsEndpoint) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        'AWS_ENDPOINT_URL is set but AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is missing',
      );
    }

    logger.info('Using local S3 emulator (MinIO)', { endpoint: awsEndpoint });

    return {
      aws: {
        region: awsRegion,
        endpoint: awsEndpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      },
      nodeEnv,
    };
  }

  // 本番環境（AWS S3）の場合、IAMロールまたは環境変数から認証情報を取得
  logger.info('Using AWS S3', { region: awsRegion });

  return {
    aws: {
      region: awsRegion,
    },
    nodeEnv,
  };
}
