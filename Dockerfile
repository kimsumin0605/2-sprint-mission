ARG NODE_VERSION=20
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY package*.json tsconfig*.json ./
RUN npm ci


COPY . .

RUN npx prisma generate --schema=src/lib/prisma/schema.prisma


RUN npm run build

FROM node:${NODE_VERSION}-slim AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/src/lib/prisma ./src/lib/prisma

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start"]
