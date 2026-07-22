
# syntax=docker/dockerfile:1.7

# The Prisma schema deliberately lives in the shared database package. The
# build context must therefore be the repository root (see docker-compose.yml).
FROM node:22-alpine AS base
WORKDIR /workspace
RUN apk add --no-cache dumb-init openssl

FROM base AS dependencies
COPY backend/package*.json ./backend/
COPY database/package*.json ./database/
# database does not need a lockfile to build; npm will honor one when present.
RUN npm ci --prefix backend && npm install --prefix database --ignore-scripts

FROM base AS build
COPY --from=dependencies /workspace/backend/node_modules ./backend/node_modules
COPY --from=dependencies /workspace/database/node_modules ./database/node_modules
COPY backend ./backend
COPY database ./database
WORKDIR /workspace/backend
RUN npm run build && npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=4000 \
    API_PREFIX=/api/v1
RUN apk add --no-cache dumb-init openssl \
    && addgroup --system --gid 1001 api \
    && adduser --system --uid 1001 --ingroup api api

COPY --from=build --chown=api:api /workspace/backend/package.json ./package.json
COPY --from=build --chown=api:api /workspace/backend/node_modules ./node_modules
COPY --from=build --chown=api:api /workspace/backend/dist ./dist

USER api
EXPOSE 4000
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start"]
