# BUILD STAGE
FROM node:22 AS build

RUN npm install -g pnpm

WORKDIR /app/food_order_be

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
