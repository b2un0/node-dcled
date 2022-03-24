FROM node:lts-alpine

ARG BUILD_DATE
ARG VCS_REF
ARG VERSION

ENV NODE_PATH="/usr/local/lib/node_modules" \
    NODE_ENV="production" \
    MQTT_HOST="" \
    MQTT_TOPIC=""

ADD . /app

WORKDIR /app

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        libc-dev \
        g++ \
        hidapi \
        libusb-dev \
        eudev-dev \
        linux-headers \
        && yarn install \
        && yarn add mqtt \
        && apk del .gyp \
        && apk add --no-cache eudev libusb

CMD ["node", "mqtt.js"]

SHELL ["/bin/ash"]

LABEL org.opencontainers.image.created=${BUILD_DATE} \
      org.opencontainers.image.revision=${VCS_REF} \
      org.opencontainers.image.version=${VERSION} \
      org.opencontainers.image.source="https://github.com/b2un0/node-dcled"
