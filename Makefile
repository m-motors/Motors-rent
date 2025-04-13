ENV_FILE=.env

ENV_MODE=production

BACKEND_PACKAGE_NAME=python-flask
BACKEND_PACKAGE_VERSION=0.0.1
FLASK_INTERNAL_PORT=5000

REVERSE_PROXY_PACKAGE_NAME=nginx
REVERSE_PROXY_PACKAGE_VERSION=0.0.1
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443

LLM_PACKAGE_NAME=ollama
LLM_PACKAGE_VERSION=0.0.1
OLLAMA_PORT=11434


.PHONY: help build run stop logs start 

help:
	@echo -e "\e[1;35m"
	@echo -e "         __  __           __  __           _                         "
	@echo -e "        |  \/  |         |  \/  |   ___   | |_    ___    _ __   ___  "
	@echo -e "        | |\/| |  _____  | |\/| |  / _ \  | __|  / _ \  | '__| / __| "
	@echo -e "        | |  | | |_____| | |  | | | (_) | | |_  | (_) | | |    \\__  "
	@echo -e "        |_|  |_|         |_|  |_|  \___/   \__|  \___/  |_|    |___/ "
	@echo -e "\e[0m"

	@echo -e "\e[1;34m#  Commandes principales pour lancer le projet\e[0m"
	@echo -e "\e[36m  make build         \e[0m => Build + start projet avec rebuild"
	@echo -e "\e[36m  make buildd        \e[0m => Build + start projet en mode detache"
	@echo -e "\e[36m  make start         \e[0m => Demarrage rapide (up --build)"
	@echo -e "\e[36m  make startd        \e[0m => Demarre en detache + logs"
	@echo -e "\e[36m  make logs          \e[0m => Logs en temps reel (backend + frontend)"

	@echo ""
	@echo -e "\e[1;35m#  LLM & IA\e[0m"
	@echo -e "\e[36m  make ia            \e[0m => Run LLM avec docker-compose.llm.yml"
	@echo -e "\e[36m  make iad           \e[0m => Run LLM en mode detache"
	@echo -e "\e[36m  make restartdwia   \e[0m => Clean + Build + LLM + Logs"

	@echo ""
	@echo -e "\e[1;32m#  Backend Flask\e[0m"
	@echo -e "\e[36m  make buildback     \e[0m => Build image Flask vers GHCR"
	@echo -e "\e[36m  make runback       \e[0m => Run image Flask localement"
	@echo -e "\e[36m  make pushback      \e[0m => Push image Flask vers GHCR"
	@echo -e "\e[36m  make restartback   \e[0m => Restart container backend"
	@echo -e "\e[36m  make pipinstall LIB=pkg \e[0m => Installer une lib Python dans le conteneur"

	@echo ""
	@echo -e "\e[1;33m#  Reverse Proxy (NGINX)\e[0m"
	@echo -e "\e[36m  make buildproxy    \e[0m => Build image proxy"
	@echo -e "\e[36m  make runproxy      \e[0m => Run image proxy localement"
	@echo -e "\e[36m  make pushproxy     \e[0m => Push image proxy vers GHCR"

	@echo ""
	@echo -e "\e[1;33m#  LLM (Ollama)\e[0m"
	@echo -e "\e[36m  make buildollama    \e[0m => Build image LLM"
	@echo -e "\e[36m  make runollama     \e[0m => Run image LLM localement"
	@echo -e "\e[36m  make pushollama     \e[0m => Push image LLM vers GHCR"

	@echo ""
	@echo -e "\e[1;31m#  Maintenance\e[0m"
	@echo -e "\e[36m  make cleanall      \e[0m => Supprime containers + volumes"
	@echo -e "\e[36m  make restartd      \e[0m => Clean + Build + Logs"
	
	@echo ""
	@echo -e "\e[35m-------------------------------------------------------------------------------\e[0m"
	@echo -e "\e[1;31m NEXT STEP RECOMMAND : make startd\e[0m"
	@echo -e ""
	@echo -e "\e[34m Interface Web :     \e[0m\e[32mhttp://localhost:5173\e[0m"
	@echo -e "\e[34m API Reference :     \e[0m\e[32mhttps://localhost:3000\e[0m"
	@echo -


start :
	docker compose --env-file .env --env-file .env.local up --build

logs : 
	docker compose logs -f

build: 
	docker compose --env-file .env --env-file .env.local up --build

buildd: 
	docker compose --env-file .env --env-file .env.local up --build -d

cleanall: 
	docker compose down -v

ia:
	$(MAKE) cleanall
	docker compose --env-file .env --env-file .env.local -f docker-compose.llm.yml up --build

iad:
	docker compose --env-file .env --env-file .env.local -f docker-compose.llm.yml up --build -d

startd :
	$(MAKE) buildd
	$(MAKE) logs

restartd:
	$(MAKE) cleanall
	$(MAKE) buildd
	$(MAKE) logs


prodstartd: 
	docker compose down -v
	docker compose -f docker-compose.prod.yml down -v
	docker compose -f docker-compose.prod.yml --env-file .env --env-file .env.local --build-arg ENV_MODE=production up --build -d
	docker compose -f docker-compose.prod.yml logs -f


restartdwia:
	$(MAKE) cleanall
	$(MAKE) buildd
	$(MAKE) iad
	$(MAKE) logs

pipinstall:
	docker compose exec backend sh -c "pip install $(LIB) && pip freeze > requirements.txt"


restartback:
	docker restart backend
	$(MAKE) logs
	

buildback :
	docker build --build-arg FLASK_INTERNAL_PORT=$(FLASK_INTERNAL_PORT) --build-arg ENV_MODE=$(ENV_MODE) -t ghcr.io/j-renevier/$(BACKEND_PACKAGE_NAME):v$(BACKEND_PACKAGE_VERSION) -f ./backend/Dockerfile.prod ./backend

runback :
	docker run --env-file .env --env-file .env.local -p 5000:$(FLASK_INTERNAL_PORT) -d ghcr.io/j-renevier/$(BACKEND_PACKAGE_NAME):v$(BACKEND_PACKAGE_VERSION) 

pushback :
	docker push ghcr.io/j-renevier/$(BACKEND_PACKAGE_NAME):v$(BACKEND_PACKAGE_VERSION)



buildproxy :
	docker build --build-arg NGINX_HTTPS_PORT=$(NGINX_HTTPS_PORT) --build-arg NGINX_HTTP_PORT=$(NGINX_HTTP_PORT) --build-arg ENV_MODE=$(ENV_MODE) -t ghcr.io/j-renevier/$(REVERSE_PROXY_PACKAGE_NAME):v$(REVERSE_PROXY_PACKAGE_VERSION) -f ./reverse-proxy/Dockerfile.prod ./reverse-proxy
	docker build --build-arg NGINX_HTTPS_PORT=$(NGINX_HTTPS_PORT) --build-arg NGINX_HTTP_PORT=$(NGINX_HTTP_PORT) --build-arg ENV_MODE=$(ENV_MODE) -t ghcr.io/j-renevier/nginx:v$(NGINX_VERSION) -f ./reverse-proxy/Dockerfile.prod ./reverse-proxy

runproxy :
	docker run --env-file .env --env-file .env.local -p 80:$(NGINX_HTTP_PORT) -p 443:$(NGINX_HTTPS_PORT) -d  ghcr.io/j-renevier/$(REVERSE_PROXY_PACKAGE_NAME):v$(REVERSE_PROXY_PACKAGE_VERSION)

pushproxy :
	docker push ghcr.io/j-renevier/$(REVERSE_PROXY_PACKAGE_NAME):v$(REVERSE_PROXY_PACKAGE_VERSION)



buildollama :
	docker build --build-arg OLLAMA_PORT=$(OLLAMA_PORT) --build-arg ENV_MODE=$(ENV_MODE) -t ghcr.io/j-renevier/$(LLM_PACKAGE_NAME):v$(LLM_PACKAGE_VERSION) -f ./llm/Dockerfile ./llm

runollama :
	docker run --env-file .env --env-file .env.local -p 11434:$(OLLAMA_PORT) -d ghcr.io/j-renevier/$(LLM_PACKAGE_NAME):v$(LLM_PACKAGE_VERSION) 

pushollama :
	docker push ghcr.io/j-renevier/$(LLM_PACKAGE_NAME):v$(LLM_PACKAGE_VERSION)

