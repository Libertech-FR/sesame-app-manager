include .env
IMGNAME?=ghcr.io/libertech-fr/sesame-app-manager
APPNAME?=sesame-app-manager
APP_PORT?=3002
PLATFORM?=linux/amd64

.DEFAULT_GOAL := help
help:
	@printf "\033[33mUsage:\033[0m\n  make [target] [arg=\"val\"...]\n\n\033[33mTargets:\033[0m\n"
	@grep -E '^[-a-zA-Z0-9_\.\/]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[32m%-15s\033[0m %s\n", $$1, $$2}'

build:
	docker build --platform $(PLATFORM) -t $(IMGNAME) .

dev:
	docker run --rm -it \
		-e NODE_ENV=development \
		-e NODE_TLS_REJECT_UNAUTHORIZED=0 \
		--add-host host.docker.internal:host-gateway \
		--name $(APPNAME) \
		--network dev \
		-p $(APP_PORT):3000 \
		-p 24678:24678 \
		-v $(CURDIR):/data \
		$(IMGNAME) yarn dev

prod:
	docker run --rm -it \
		-e NODE_ENV=production \
		-e NODE_TLS_REJECT_UNAUTHORIZED=0 \
		--add-host host.docker.internal:host-gateway \
		--name $(APPNAME) \
		--network dev \
		-p $(APP_PORT):3000 \
		-p 24678:24678 \
		-v $(CURDIR):/data \
		$(IMGNAME) yarn start:prod

install:
	docker run -it --rm \
		-e NODE_ENV=development \
		-v $(CURDIR):/data \
		$(IMGNAME) yarn install

exec:
	docker run -it --rm \
		-e NODE_ENV=development \
		-v $(CURDIR):/data \
		$(IMGNAME) bash
