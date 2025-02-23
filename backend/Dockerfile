FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

ARG FLASK_INTERNAL_PORT
ARG ENV_MODE

RUN echo "###"
RUN echo "Image: python:3.11-slim"
RUN echo "PORT: ${FLASK_INTERNAL_PORT}"
RUN echo "ENV_MODE: ${ENV_MODE}"
RUN echo "###"

WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
    

FROM base AS development

RUN pip install --upgrade pip setuptools wheel \
&& pip install flask-debugtoolbar debugpy

EXPOSE ${FLASK_INTERNAL_PORT}

CMD ["sh", "-c", "python ./src/infrastructure/scripts/migrate.py && flask --app ./main.py run --host=0.0.0.0 --reload"]


FROM base AS debug

RUN pip install --upgrade pip setuptools wheel \
    && pip install flask-debugtoolbar debugpy

EXPOSE ${FLASK_INTERNAL_PORT}
EXPOSE 5678

CMD ["sh", "-c", "python ./src/infrastructure/scripts/migrate.py && python -m debugpy --listen 0.0.0.0:5678 -m flask --app ./main.py run --host=0.0.0.0 --reload"]


