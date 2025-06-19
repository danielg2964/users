FROM node:22-alpine AS base

COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN npm ci --prod 

FROM base AS type-check
RUN npm ci
RUN npx tsc

FROM type-check AS tester
RUN node --run test

FROM node:22-alpine

WORKDIR /app

COPY . ./
COPY --from=prod-deps /app/node_modules ./node_modules

CMD ["node", "--run", "start"]
