import winston from 'winston';

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

// ロガー設定
export const logger = winston.createLogger({
  level: process.env.DEBUG === 'true' ? 'debug' : 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({ filename: 'logs/app.log' })],
});

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
        'AWS_ENDPOINT_URL is set but AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is missing'
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
