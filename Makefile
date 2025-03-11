ENV_FILE=.env
ENV_MODE?=production
BACKEND_PORT=5000
FRONTEND_PORT=5173


ENV_MODE=production

PYTHON_FLASK_VERSION=0.0.1
FLASK_INTERNAL_PORT=5000

NGINX_VERSION=0.0.1
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443


.PHONY: help build run stop logs start 

help:
	@echo "Commands :"
	@echo "  build => Build Docker image"
	@echo "  run   => Run app with Docker Compose"
	@echo "  stop  => Stop Docker services"
	@echo "  logs  => See backend and frontend logs"
	@echo "  llm   => Run app with Docker Compose + LLM"

start :
	docker compose --env-file .env --env-file .env.local up --build

logs : 
	docker compose logs -f

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

restartdwia:
	$(MAKE) cleanall
	$(MAKE) buildd
	$(MAKE) iad
	$(MAKE) logs

startback:
	docker compose --env-file .env --env-file .env.local backend up -d
	

buildback :
	docker build --build-arg FLASK_INTERNAL_PORT=$(FLASK_INTERNAL_PORT) --build-arg ENV_MODE=$(ENV_MODE) -t ghcr.io/j-renevier/python-flask:v$(PYTHON_FLASK_VERSION) -f ./backend/Dockerfile.prod ./backend

runback :
	docker run --env-file .env --env-file .env.local -p 5000:$(FLASK_INTERNAL_PORT) -d ghcr.io/j-renevier/python-flask:v$(PYTHON_FLASK_VERSION) 

pushback :
	docker push ghcr.io/j-renevier/python-flask:v$(PYTHON_FLASK_VERSION)


buildproxy :
	docker build --build-arg NGINX_HTTPS_PORT=$(NGINX_HTTPS_PORT) --build-arg NGINX_HTTP_PORT=$(NGINX_HTTP_PORT) --build-arg ENV_MODE=$(ENV_MODE) -t ghcr.io/j-renevier/nginx:v$(NGINX_VERSION) -f ./reverse-proxy/Dockerfile.prod ./reverse-proxy

runproxy :
	docker run --env-file .env --env-file .env.local -p 80:$(NGINX_HTTP_PORT) -p 443:$(NGINX_HTTPS_PORT) -d  ghcr.io/j-renevier/nginx:v$(NGINX_VERSION)

pushproxy :
	docker push ghcr.io/j-renevier/nginx:v$(NGINX_VERSION)

	

build:
	docker-compose build

run:
	ENV_MODE=$(ENV_MODE) docker-compose up --build -d

stop:
	docker-compose down

rebuild: clean build run