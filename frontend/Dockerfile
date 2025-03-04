FROM node:23-alpine3.20 AS development

WORKDIR /var/www
COPY package*.json ./

RUN npm ci

ARG VITE_PORT
ARG ENV_MODE

RUN echo "###"
RUN echo "Image: node:23-alpine3.20"
RUN echo "PORT: ${VITE_PORT}"
RUN echo "ENV_MODE: ${ENV_MODE}"
RUN echo "###"

COPY . .  

EXPOSE 5173

CMD ["npm", "run", "dev"]