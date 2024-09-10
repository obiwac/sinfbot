# Based of https://bun.sh/guides/ecosystem/docker

FROM oven/bun:1 AS base
WORKDIR /app

ARG GIT_COMMIT
ARG GIT_BRANCH
ARG GIT_REMOTE

ENV GIT_COMMIT=$GIT_COMMIT
ENV GIT_BRANCH=$GIT_BRANCH
ENV GIT_REMOTE=$GIT_REMOTE

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease app/src src
COPY --from=prerelease app/package.json .

USER bun
ENTRYPOINT ["bun", "start"]
