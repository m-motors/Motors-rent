FROM node:23-alpine3.20 AS base
WORKDIR /var/www
RUN echo "Image: node:23-alpine3.20"
COPY package*.json ./
RUN npm ci
EXPOSE 5173

# Environnement de développement
FROM base AS development
RUN echo "ENV_MODE: development"
COPY . .  
RUN npm install --only=development
CMD ["npm", "run", "dev"]

# Environnement de développement
FROM base AS debug
RUN echo "ENV_MODE: development"
COPY . .  
RUN npm install --only=development
CMD ["npm", "run", "dev"]