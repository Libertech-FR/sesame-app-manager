FROM node:20-bookworm-slim

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /usr/src/app

# Install dependencies. Note that the package names and the package manager are different for Debian-based images.
RUN apt-get update && apt-get -y --no-install-recommends upgrade && apt-get install -y --no-install-recommends \
  git \
  jq \
  nano \
  vim \
  bash \
  bash-completion \
  iputils-ping \
  telnet \
  dnsutils \
  net-tools \
  tcpdump \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

COPY . .

RUN yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false
# && yarn cache clean \
# && yarn autoclean --init \
# && yarn autoclean --force

RUN yarn build

EXPOSE 3000

CMD ["yarn", "run", "start:prod"]
