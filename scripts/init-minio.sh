#!/bin/bash
# scripts/init-minio.sh

set -e

echo "🔧 Initializing MinIO..."

# MinIO CLIエイリアス設定
docker exec minio mc alias set local http://localhost:9000 minioadmin minioadmin

# デフォルトバケット作成
docker exec minio mc mb local/my-app-bucket --ignore-existing

# バケット一覧確認
echo "📦 MinIO buckets:"
docker exec minio mc ls local

echo "✅ MinIO setup complete"
