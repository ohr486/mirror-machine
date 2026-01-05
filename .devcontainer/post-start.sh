#!/bin/bash
# .devcontainer/post-start.sh
# DevContainer起動後の初期化スクリプト
#
# Requirements:
# - 1.4: プロジェクトの依存関係が自動的にインストールされた状態になる
# - 10.3: S3エミュレーターがローカル環境でS3互換APIを提供する
# - 10.8: S3エミュレーターの初期セットアップスクリプト（バケット作成等）を提供する

set -e

# MinIOコンテナを起動
echo "🚀 Starting MinIO..."
docker-compose up -d

# MinIOのhealthcheckを待機（最大60秒）
echo "⏳ Waiting for MinIO to be ready..."
for i in {1..60}; do
  if docker exec minio curl -f http://localhost:9000/minio/health/live > /dev/null 2>&1; then
    echo "✅ MinIO is ready!"
    break
  fi
  if [ $i -eq 60 ]; then
    echo "❌ MinIO healthcheck timeout"
    exit 1
  fi
  sleep 1
done

# MinIOの初期セットアップ（バケット作成）
echo "🔧 Initializing MinIO..."
bash ./scripts/init-minio.sh

echo "✅ Development environment ready!"
