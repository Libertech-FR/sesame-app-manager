include .env
IMGNAME?=ghcr.io/libertech-fr/sesame-app-manager
APPNAME?=sesame-app-manager
APP_PORT?=3002
PLATFORM?=linux/amd64

CERT_DIR = ./certificates
COMMON_NAME = localhost
DAYS_VALID = 365

$(shell mkdir -p $(CERT_DIR))

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
		-e DEV=1 \
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

generate-ssl-cert: ## Générer les certificats HTTPS auto-signés
	@echo "Génération des certificats HTTPS auto-signés..."
	@openssl req -x509 \
		-newkey rsa:4096 \
		-keyout $(CERT_DIR)/server.key \
		-out $(CERT_DIR)/server.crt \
		-days $(DAYS_VALID) \
		-nodes \
		-subj "/CN=$(COMMON_NAME)"
	@chmod 600 $(CERT_DIR)/server.key
	@chmod 644 $(CERT_DIR)/server.crt
	@echo "Certificats générés avec succès dans $(CERT_DIR)"

clean-ssl-cert: ## Nettoyer les certificats HTTPS
	@rm -rf $(CERT_DIR)
	@echo "Certificats supprimés"

show-cert-info: ## Afficher les informations du certificat
	@openssl x509 -in $(CERT_DIR)/server.crt -text -noout
