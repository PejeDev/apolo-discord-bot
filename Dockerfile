FROM node:18-slim

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm fetch --frozen-lockfile

RUN pnpm install --frozen-lockfile

COPY src/ ./src

EXPOSE 3000

CMD [ "node", "--loader", "@swc-node/register/esm", "--no-warnings", "src/main.ts" ]