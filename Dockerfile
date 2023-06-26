FROM node:18

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN corepack enable

RUN apt-get update && apt-get install 'ffmpeg' -y --no-install-recommends \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.json ./

RUN pnpm fetch --frozen-lockfile

RUN pnpm install --frozen-lockfile

COPY src/ ./src
# Optional API/Backend port
EXPOSE 3000

# Run the start command
CMD [ "node", "--loader", "@swc-node/register/esm", "--no-warnings", "src/main.ts" ]
