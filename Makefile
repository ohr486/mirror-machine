.PHONY: help test lint format cleanup dev logs init-minio pull build up down

BIN := ./node_modules/.bin

help: ## ヘルプ表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

test: ## テスト実行
	npm test

lint: ## リント実行
	npm run lint

format: ## フォーマット実行
	npm run format

cleanup: ## クリーンアップ（node_modules、coverage等削除）
	rm -rf node_modules coverage dist .turbo

dev: ## 開発モード起動
	npm run dev

logs: ## ログtail表示
	tail -f logs/app.log 2>/dev/null || echo "No logs found"

init-minio: ## MinIO初期セットアップ
	./scripts/init-minio.sh

pull: ## docker-composeイメージをpull
	docker-compose pull

build: ## docker-composeイメージをbuild（将来のカスタムビルド用）
	docker-compose build

up: pull ## docker-compose起動（初回はpull実行）
	docker-compose up -d

down: ## docker-compose停止
	docker-compose down
