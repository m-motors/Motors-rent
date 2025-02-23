ENV_FILE=.env
ENV_MODE?=production
BACKEND_PORT=5000
FRONTEND_PORT=5173


BACK_VERSION=0.0.3
ENV_MODE=production
FLASK_PORT=5000

.PHONY: help build run stop logs start

help:
	@echo "Commands :"
	@echo "  build => Build Docker image"
	@echo "  run   => Run app with Docker Compose"
	@echo "  stop  => Stop Docker services"
	@echo "  logs  => See backend and frontend logs"
	@echo "  llm   => Run app with Docker Compose + LLM"


start :
	docker compose --env-file .env --env-file .env.local -f docker-compose.frontend.yml -f docker-compose.backend.yml -f docker-compose.db.yml up --build

logs : 
	docker logs -f postgres   | awk '{print "\033[1;31m[POSTGRES]\033[0m " $$0}' & \
	docker logs -f pgadmin    | awk '{print "\033[1;36m[PGADMIN]\033[0m " $$0}' & \
	docker logs -f backend    | awk '{print "\033[1;32m[BACKEND]\033[0m " $$0}' & \
	docker logs -f frontend   | awk '{print "\033[1;35m[FRONTEND]\033[0m " $$0}'

buildd: 
	docker compose --env-file .env --env-file .env.local -f docker-compose.frontend.yml -f docker-compose.backend.yml -f docker-compose.db.yml up --build -d

cleanall: 
	docker ps -a --format "{{.Names}}" | grep -q "^readme$$" && docker rm -f readme || true
	docker stop postgres pgadmin backend frontend
	docker  rm -f postgres pgadmin backend frontend
	docker volume rm motors-rent_postgres_data motors-rent_pgadmin_data

startd :
	$(MAKE) buildd
	$(MAKE) logs

restartd:
	$(MAKE) cleanall
	$(MAKE) buildd
	$(MAKE) logs


startbackendprodall:
	docker compose --env-file .env --env-file .env.local -f docker-compose.frontend.yml -f docker-compose.backend.prod.yml -f docker-compose.db.yml up -d
	docker compose --env-file .env --env-file .env.local -f docker-compose.reverse-proxy.yml up --build

startbackendprod:
	docker compose --env-file .env --env-file .env.local -f docker-compose.reverse-proxy.yml up --build

build:
	docker-compose build

run:
	ENV_MODE=$(ENV_MODE) docker-compose up --build -d

stop:
	docker-compose down



rebuild: clean build run



llm:
	docker-compose -f docker-compose.yml -f docker-compose.llm.yml up -d


buildback :
	docker build --build-arg FLASK_PORT=$(FLASK_PORT) --build-arg ENV_MODE=$(ENV_MODE) -t ghcr.io/j-renevier/backend:v$(BACK_VERSION) -f ./backend/Dockerfile.prod ./backend

pushback :
	docker push ghcr.io/j-renevier/backend:v$(BACK_VERSION)
