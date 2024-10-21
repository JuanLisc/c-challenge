# Development stage
FROM node:20.11-alpine as development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./
COPY ./src ./src
COPY ./database ./database
COPY ./.sequelizerc .

COPY ./docker-entrypoint.sh .
#ENTRYPOINT ["sh", "docker-entrypoint.sh"]

# Builder stage
FROM development as builder

WORKDIR /app

RUN npm run build

RUN rm -rf node_modules
RUN npm ci --only=production

# Production stage
FROM node:20.11-alpine as production
WORKDIR /root/
COPY --from=builder /app ./

COPY ./docker-entrypoint.sh .
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
CMD [ "node", "dist/main" ]