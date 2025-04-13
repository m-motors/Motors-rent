FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Dépendances système nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

ARG FLASK_INTERNAL_PORT=5000
ARG ENV_MODE=dev

# Affichage des arguments pour debug
RUN echo "###" && \
    echo "Image: python:3.11-slim" && \
    echo "PORT: ${FLASK_INTERNAL_PORT}" && \
    echo "ENV_MODE: ${ENV_MODE}" && \
    echo "###"

WORKDIR /app
COPY ./requirements.txt /app/requirements.txt

# Mise à jour de pip et installation plus robuste
RUN pip install --upgrade pip setuptools wheel && \
    pip install --default-timeout=60 --no-cache-dir -r requirements.txt


# --- STAGE: development ---
FROM base AS development

RUN pip install flask-debugtoolbar debugpy

EXPOSE ${FLASK_INTERNAL_PORT}
ENV FLASK_ENV=development

# CMD en array form, sh -c utile uniquement si tu as plusieurs commandes
CMD flask --app ./main.py run --host=0.0.0.0 --port=${FLASK_INTERNAL_PORT} --reload
# Ou pour exécuter un script avant le lancement :
# CMD sh -c "python ./src/infrastructure/scripts/migrate.py && flask --app ./main.py run --host=0.0.0.0 --port=${FLASK_INTERNAL_PORT} --reload"


# --- STAGE: debug ---
FROM base AS debug

RUN pip install flask-debugtoolbar debugpy

EXPOSE ${FLASK_INTERNAL_PORT}
EXPOSE 5678

CMD python -m debugpy --listen 0.0.0.0:5678 -m flask --app ./main.py run --host=0.0.0.0 --port=${FLASK_INTERNAL_PORT} --reload
# Ou avec migration avant :
# CMD sh -c "python ./src/infrastructure/scripts/migrate.py && python -m debugpy --listen 0.0.0.0:5678 -m flask --app ./main.py run --host=0.0.0.0 --port=${FLASK_INTERNAL_PORT} --reload"
