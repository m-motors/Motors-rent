ENV_FILE=.env
ENV_MODE?=production

BACKEND_PORT=5000
FRONTEND_PORT=5173

.PHONY: help build run stop logs

help:
	@echo "Commands :"
	@echo "  build => Build Docker image"
	@echo "  run   => Run app with Docker Compose"
	@echo "  stop  => Stop Docker services"
	@echo "  logs  => See backend and frontend logs"


build:
	docker-compose build

run:
	ENV_MODE=$(ENV_MODE) docker-compose up --build -d

stop:
	docker-compose down

logs:
	docker-compose logs -f backend frontend

rebuild: clean build run

restart: 
	docker compose down -v
	docker compose up --build
