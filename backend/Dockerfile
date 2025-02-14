FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

FROM base AS development

RUN pip install --upgrade pip setuptools wheel \
    && pip install flask-debugtoolbar debugpy

EXPOSE 3000
ENV PYTHONPATH=/app/src

CMD ["flask", "--app", "./main.py", "run", "--host=0.0.0.0", "--reload"]

