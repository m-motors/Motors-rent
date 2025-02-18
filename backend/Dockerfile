FROM python:3.11-slim AS base
LABEL stage=base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

#development
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

FROM base AS development
LABEL stage=development

RUN pip install --upgrade pip setuptools wheel \
&& pip install flask-debugtoolbar debugpy

EXPOSE 3000
ENV PYTHONPATH=/app/src

CMD ["flask", "--app", "./main.py", "run", "--host=0.0.0.0", "--reload"]

# production
FROM base AS production
LABEL stage=production

RUN pip install --no-cache-dir gunicorn
COPY ./gunicorn.conf.py /app/gunicorn.conf.py

EXPOSE 5000

CMD ["gunicorn", "--config", "./gunicorn.conf.py", "main:app"]

#debug
FROM base AS debug
LABEL stage=debug

RUN pip install --upgrade pip setuptools wheel \
    && pip install flask-debugtoolbar debugpy

EXPOSE 3000
EXPOSE 5678

CMD ["python", "-Xfrozen_modules=off", "-m", "debugpy", "--listen", "0.0.0.0:5678", "-m", "flask", "--app", "./main.py", "run", "--host=0.0.0.0", "--reload"]
